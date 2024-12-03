import os
import time
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set environment variables for API keys
os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")
os.environ['GROQ_API_KEY'] = os.getenv("GROQ_API_KEY")

# Initialize the Groq model
groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

# Initialize the prompt template
prompt = ChatPromptTemplate.from_template("""
    Answer the questions based on the provided context only.
    Please provide the most accurate response based on the question
    <context>
    {context}
    <context>
    Question:{input}
""")

# Global variables for embeddings, documents, and vector store
embeddings = None
loader = None
docs = None
text_splitter = None
final_documents = None
vectors = None

def create_vector_embedding(pdf_file_path):
    """
    Processes the incoming PDF document by loading it, splitting it into chunks, 
    creating embeddings, and storing them in a FAISS vector database. 
    Deletes the PDF file after processing.
    
    Args:
        pdf_file_path (str): The file path of the incoming PDF to be processed.
    """
    global embeddings, loader, docs, text_splitter, final_documents, vectors
    embeddings = OpenAIEmbeddings()
    
    # Load the new PDF document
    loader = PyPDFDirectoryLoader(pdf_file_path)
    docs = loader.load()  # Document Loading
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs[:50])  # Limit documents to first 50
    vectors = FAISS.from_documents(final_documents, embeddings)  # Creating the vector store
    
    # Delete the PDF after processing
    os.remove(pdf_file_path)
    print(f"Processed and deleted {pdf_file_path}")

def watch_folder_for_new_pdfs(folder_path):
    """
    Monitors a specified folder for new PDF files and processes them automatically.
    This function runs in a separate thread, watching for new files indefinitely.
    
    Args:
        folder_path (str): The folder path to monitor for new PDF files.
    """
    class PdfHandler(FileSystemEventHandler):
        def on_created(self, event):
            if event.is_directory:
                return
            
            # Check if the new file is a PDF
            if event.src_path.endswith(".pdf"):
                print(f"New PDF detected: {event.src_path}")
                create_vector_embedding(event.src_path)
    
    event_handler = PdfHandler()
    observer = Observer()
    observer.schedule(event_handler, folder_path, recursive=False)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

@app.route('/query', methods=['POST'])
def query_document():
    """
    API endpoint to query the document database with a user-provided question.
    
    Args:
        query (str): The user-provided question to ask the document database.
    
    Returns:
        A JSON response containing:
        - 'answer': The answer generated from the relevant documents.
        - 'response_time': The time taken to process the query.
        - 'context': The context (documents) that were used to generate the answer.
    """
    user_prompt = request.json.get('query')
    if not user_prompt:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        start = time.process_time()
        response = retrieval_chain.invoke({'input': user_prompt})
        response_time = time.process_time() - start

        answer = response.get('answer')
        context = response.get('context')

        response_data = {
            "answer": answer,
            "response_time": response_time,
            "context": context
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    """
    Starts the Flask app and listens on the default port (5000) for incoming requests.
    It also starts the PDF folder monitoring process in a separate thread.
    """
    # Start the folder monitoring process in a separate thread
    folder_path = "shared_documents"  # Folder where incoming PDFs are stored
    threading.Thread(target=watch_folder_for_new_pdfs, args=(folder_path,), daemon=True).start()

    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
