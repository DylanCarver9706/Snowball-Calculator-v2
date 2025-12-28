# Snowball Calculator - Dave Ramsey Debt Payoff Tool

A beautiful web application for calculating debt payoff using the Dave Ramsey snowball method. Built with Next.js, Material UI, and modern web technologies.

## Features

- **Conversion-Focused Design**: Optimized homepage with multiple CTAs for signup
- **Modern UI**: Sleek Material UI components with Tailwind CSS
- **Authentication**: Secure user authentication with Clerk
- **Analytics**: Basic web traffic analytics with PostHog
- **Responsive**: Mobile-friendly design that works on all devices
- **Educational Content**: Comprehensive resources and guides

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Material UI (MUI) v5
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Analytics**: PostHog
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- PostHog account (for analytics)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd snowball-calculator
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` and add your API keys:

   - Get Clerk keys from [clerk.com](https://clerk.com)
   - Get PostHog key from [posthog.com](https://posthog.com)

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Site URL
NEXT_PUBLIC_SITE_URL=https://mydebtsnowball.com

# Feedback System (Optional - feedback will still work without Trello)
# Resend Email Service
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@mydebtsnowball.com
FEEDBACK_EMAIL=your-email@example.com

# Trello Integration (Optional)
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_TOKEN=your_trello_token_here
# Different lists for different feedback types
NEXT_PUBLIC_TRELLO_GENERAL_LIST_ID=your_general_list_id_here
NEXT_PUBLIC_TRELLO_BUG_LIST_ID=your_bug_list_id_here
NEXT_PUBLIC_TRELLO_ENHANCEMENT_LIST_ID=your_enhancement_list_id_here
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── calculator/        # Calculator page (placeholder)
│   ├── how-it-works/     # Educational content
│   ├── resources/         # Resources and tools
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── Navbar.tsx        # Navigation component
│   └── PostHogProvider.tsx # Analytics provider
├── public/               # Static assets
└── package.json          # Dependencies
```

## Pages

- **Homepage (`/`)**: Conversion-focused landing page with multiple CTAs
- **How It Works (`/how-it-works`)**: Detailed explanation of the snowball method
- **Resources (`/resources`)**: Educational content and tools
- **Calculator (`/calculator`)**: Interactive debt snowball calculator
- **Feedback (`/feedback`)**: User feedback form that sends emails and creates Trello cards

## Customization

### Colors and Theme

The app uses a custom Material UI theme. Edit the theme in `app/layout.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Change primary color
    },
    secondary: {
      main: "#10b981", // Change secondary color
    },
  },
});
```

### Content

- Update homepage content in `app/page.tsx`
- Modify educational content in `app/how-it-works/page.tsx`
- Edit resources in `app/resources/page.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Feedback System Setup

The feedback system allows users to submit feedback, bug reports, and feature requests. It integrates with:

1. **Resend** - Sends email notifications when feedback is submitted
2. **Trello** - Creates cards in your Trello board for tracking

### Setting up Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your `.env.local`
4. Set `RESEND_FROM_EMAIL` to a verified domain email
5. Set `FEEDBACK_EMAIL` to the email where you want to receive notifications

### Setting up Trello (Optional)

1. Go to [trello.com/app-key](https://trello.com/app-key) to get your API key
2. Generate a token at [trello.com/1/authorize](https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Feedback%20System&key=YOUR_API_KEY)
3. Create three lists in your Trello board:
   - One for general feedback
   - One for bug reports
   - One for feature requests/enhancements
4. Get the list IDs from each list (you can find them in the Trello board URL or use the API)
5. Add the following to your `.env.local`:
   - `TRELLO_API_KEY` - Your Trello API key
   - `TRELLO_TOKEN` - Your Trello token
   - `NEXT_PUBLIC_TRELLO_GENERAL_LIST_ID` - List ID for general feedback
   - `NEXT_PUBLIC_TRELLO_BUG_LIST_ID` - List ID for bug reports
   - `NEXT_PUBLIC_TRELLO_ENHANCEMENT_LIST_ID` - List ID for feature requests

**Note**: The feedback system will route different feedback types to different Trello lists automatically. If Trello is not configured, the system will still send emails.

## Next Steps

1. **Add Database**: Integrate a database for user data and saved calculations
2. **Enhanced Analytics**: Add custom PostHog events for better tracking
3. **Email Marketing**: Integrate with email service for user engagement
4. **Performance**: Implement image optimization and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a conversion-focused application designed to drive user signups. The actual calculator functionality will be implemented separately as mentioned in the project requirements.
