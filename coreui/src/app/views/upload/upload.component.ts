import { Component } from '@angular/core';
import { CardComponent, ColComponent, FormControlDirective, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';

@Component({
  selector: 'app-upload',
  imports: [FormControlDirective, CardComponent, ColComponent, CardHeaderComponent,CardBodyComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

}
