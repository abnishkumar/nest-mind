import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Application Management',
    url: '/chat-bot',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Document Upload',
        url: '/upload',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Bot',
        url: '/chat-bot',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
