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

3. **Generate audio files**:
   - Open `http://localhost:3000/sounds/generate-sounds.html` in your browser
   - Click "Generate Sound Files" to download audio files
   - Move the generated `.wav` files to the `public/sounds/` directory

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Game Flow

### Initial State
- Console displays with 100% fuel and 15:00 countdown
- All systems show "ONLINE" status
- QR code scanner button is available

### Warning Phase (Fuel < 20%)
- Red warning panel appears with pulsing animation
- Audio alarm plays every 10 seconds
- "ENTER FUEL CODE" button becomes available

### QR Code Scanning
- Click "SCAN QR CODE" button
- Transmission panel opens with Morse code message
- Audio plays the decoded message
- Message reveals fuel code hint: "FUEL SCIENCE"

### Fuel Code Entry
- 4-character input field with key beep sounds
- Accepts: FUEL, HYDR, QUAN, DEUT
- Correct code restores fuel to 100%
- Wrong attempts are tracked

### Game Over
- When countdown reaches 00:00
- "NO FUEL REMAINING" message
- Mission failure state

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
