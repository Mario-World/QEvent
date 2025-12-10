# QEvent

QEvent is a modern event management platform built with Next.js and Tailwind CSS. It allows users to create, manage, and explore events seamlessly. The platform is designed to be user-friendly and visually appealing, leveraging the power of modern web technologies.

## Features

- **Event Management**: Create and manage events with ease.
- **Artist Directory**: Browse and explore a list of artists.
- **Tagging System**: Organize events and content using tags.
- **Authentication**: Secure user authentication using NextAuth.js.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Reusable Components**: Modular and reusable React components.

## Project Structure

The project follows a structured and modular architecture:

```
app/
  globals.css          # Global styles
  layout.js            # Application layout
  (home)/
    page.js            # Home page
  api/
    auth/
      [...nextauth]/
        route.js       # Authentication API route
  artists/
    page.jsx           # Artists page
  create-event/
    page.jsx           # Create Event page
  events/
    page.jsx           # Events page
    [eventId]/
      page.jsx         # Event details page
  tags/
    page.jsx           # Tags page
components/
  ArtistCard.jsx       # Artist card component
  EventCard.jsx        # Event card component
  Header.jsx           # Header component
  SessionWrapper.jsx   # Session wrapper for authentication
  SwiperComponent.jsx  # Swiper component for carousels
  Tag.jsx              # Tag component
  theme-provider.jsx   # Theme provider component
constants/
  dummyEvents.js       # Dummy event data
  swiperContent.js     # Swiper content data
public/
  images/              # Public assets
```

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: React

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mario-World/QEvent.git
   ```

2. Navigate to the project directory:
   ```bash
   cd QEvent
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To build the project for production:
```bash
npm run build
# or
yarn build
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
