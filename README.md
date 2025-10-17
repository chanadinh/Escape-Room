# Retro Sci-Fi Escape Room Console

A Next.js-based interactive escape room experience with a retro sci-fi spaceship control console interface.

## Features

### 🚀 Core Functionality
- **Time-based countdown**: 15-minute fuel depletion timer
- **Action-based cues**: QR code scanning and fuel code entry
- **Audio system**: Warning alarms, Morse code transmissions, and key beep sounds
- **Responsive design**: Works on monitors, tablets, and computers

### 🎮 Game Mechanics
- **Fuel Warning System**: Alerts when fuel drops below 20%
- **QR Code Transmission**: Scans trigger incoming Morse code messages
- **Fuel Code Entry**: 4-character code system to restore fuel
- **Game Over State**: Mission failure when time runs out

### 🎨 Visual Design
- **Retro Sci-Fi Aesthetic**: Star Trek/Star Wars inspired interface
- **Animated Elements**: Glowing text, scanlines, and flicker effects
- **Control Console UI**: Realistic spaceship dashboard
- **Responsive Layout**: Adapts to different screen sizes

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd escape-room
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - **Local MongoDB**: Make sure MongoDB is running on your system
   - **MongoDB Atlas**: Create a free cluster and get your connection string
   - Update the `.env` file with your MongoDB URI:
     ```bash
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/escape-room
     ```

4. **Configure domain and fuel code**:
   - Copy `.env.example` to `.env` and update the values:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` file to set your domain and fuel code:
     ```bash
     NEXT_PUBLIC_BASE_URL=https://your-actual-domain.com
     NEXT_PUBLIC_FUEL_CODE=YOUR_4_CHAR_CODE
     ```

5. **Generate audio files**:
   - Open `http://localhost:3000/sounds/generate-sounds.html` in your browser
   - Click "Generate Sound Files" to download audio files
   - Move the generated `.wav` files to the `public/sounds/` directory

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:3000`

### QR Code Setup

The application includes 4 QR codes that can be accessed at:
- `https://your-domain.com/qr_1`
- `https://your-domain.com/qr_2`
- `https://your-domain.com/qr_3`
- `https://your-domain.com/qr_4`

**Important**: Update the `NEXT_PUBLIC_BASE_URL` in your `.env` file to match your actual domain name so the QR codes contain the correct URLs.

Each QR code page allows printing and downloading of the QR code for physical use in your escape room.

## Game Flow

### Initial State
- Console displays with 100% fuel and 15:00 countdown
- All systems show "ONLINE" status
- QR code selection buttons are available
- Background Morse code music starts after first interaction

### Warning Phase (Fuel < 20%)
- Red warning panel appears with pulsing animation
- Audio alarm plays every 10 seconds
- "ENTER FUEL CODE" button becomes available

### QR Code Scanning & Tracking
- **QR Code Access**: Click any "QR #X" button to access QR code pages
- **QR Code Logging**: Each QR page access is logged to MongoDB with timestamp
- **Automatic Trigger**: When a QR code is scanned (page accessed), the main console automatically opens the fuel entry modal
- **Source Tracking**: Transmission page shows which QR code was scanned

### Fuel Code Entry
- 4-character input field with key beep sounds
- Accepts: FUEL, HYDR, QUAN, DEUT (configurable via NEXT_PUBLIC_FUEL_CODE)
- Correct code restores fuel to 100% and triggers win state
- Wrong attempts are tracked and cause ship damage
- Attempts counter persists across modal sessions

### Win State
- "MISSION ACCOMPLISHED" overlay appears
- Background music stops
- Win sound plays
- Timer stops and shows remaining time

### Game Over
- When countdown reaches 00:00 or damage reaches 100%
- "NO FUEL REMAINING" or "CRITICAL DAMAGE" message
- Mission failure state
- Background music stops

## Customization

### Changing Fuel Code
Edit the `handleFuelCodeSubmit` function in `src/app/page.tsx`:
```typescript
if (code === 'YOUR_CODE_HERE') {
  // Success logic
}
```

### Adjusting Timer
Modify the initial time in `src/app/page.tsx`:
```typescript
const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
```

### Audio Files
Replace the generated audio files in `public/sounds/`:
- `warning-alarm.wav` - Low fuel warning sound
- `morse-code.wav` - Transmission audio
- `key-beep.wav` - Keyboard input sound

## Technical Details

### Built With
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web Audio API** - Sound generation
- **QR Code Library** - QR functionality

### Project Structure
```
escape-room/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main game component
│   │   ├── layout.tsx        # App layout
│   │   └── globals.css       # Global styles
│   └── components/
│       ├── ControlConsole.tsx    # Main dashboard
│       ├── FuelWarning.tsx       # Warning panel
│       ├── TransmissionPanel.tsx # QR scan result
│       └── FuelCodeEntry.tsx     # Code input
├── public/
│   └── sounds/               # Audio files
└── package.json
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- No environment variables required
- Works in any modern web browser
- Responsive design for various screen sizes

## Troubleshooting

### Audio Issues
- Ensure audio files are in `public/sounds/`
- Check browser audio permissions
- Use HTTPS for production (required for audio autoplay)

### Import Errors
- Verify TypeScript path mapping in `tsconfig.json`
- Check component file locations
- Restart development server

### Performance
- Audio files are preloaded for smooth playback
- CSS animations are optimized for performance
- Responsive design prevents layout shifts

## License

This project is created for educational and entertainment purposes. Feel free to modify and adapt for your escape room needs.# Escape-Room
