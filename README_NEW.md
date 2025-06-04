# YoApp - Angular 17 Firebase Solar Monitoring App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19.

## Features

- 🏠 **Multi-page Angular app** with routing (Home, About, Contact, Login, Register, Dashboard)
- 🔥 **Firebase Integration** for authentication and data storage
- ☀️ **SolarEdge API Integration** for real-time solar consumption data
- 📱 **Mobile-responsive design** with SCSS styling
- 🔔 **Browser notifications** for consumption alerts
- ⚡ **Auto-refresh** consumption data every minute
- 🌐 **CORS proxy support** for API calls during development

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### GitHub Pages Build

Run `npm run build:gh-pages` to build the project optimized for GitHub Pages deployment with the correct base href.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## GitHub Pages Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository
2. **Enable GitHub Pages**: 
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as the source
3. **Automatic Deployment**: The app will automatically deploy when you push to the `main` branch

### Manual Deployment:

If you prefer manual deployment, you can use the Angular CLI GitHub Pages schematic:

```bash
# Install the GitHub Pages schematic
npm install -g angular-cli-ghpages

# Build and deploy
npm run build:gh-pages
npx angular-cli-ghpages --dir=dist/yoapp
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/          # Landing page
│   │   ├── about/         # SolarEdge API integration
│   │   ├── contact/       # JSONP API calls & notifications
│   │   ├── login/         # Firebase authentication
│   │   ├── register/      # User registration
│   │   ├── dashboard/     # Protected user area
│   │   └── layout/        # Header & footer components
│   ├── services/
│   │   ├── auth.service.ts    # Firebase authentication
│   │   └── firebase.service.ts # Firebase database operations
│   └── environments/     # Environment configurations
└── public/               # Static assets
```

## Environment Configuration

Update the Firebase configuration in `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your actual Firebase project credentials.

## API Integration Notes

- **Development**: Uses CORS proxy (`https://corsproxy.io/`) for SolarEdge API calls
- **Production**: Should implement backend proxy for security
- **JSONP Support**: Configured for APIs that support JSONP callbacks
- **Mock Data**: Fallback data available when API calls fail

## Technologies Used

- **Angular 17** with standalone components
- **Firebase** for authentication and database
- **SCSS** for styling
- **RxJS** for reactive programming
- **Angular Material** for UI components
- **TypeScript** for type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests with `ng test`
5. Submit a pull request

## License

This project is licensed under the MIT License.
