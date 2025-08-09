# Contributing to Janasena Event App

Thank you for your interest in contributing to the Janasena Formation Day Event App! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Provide detailed information about the issue
- Include steps to reproduce the problem
- Mention your device/browser information

### Suggesting Features
- Open an issue with the "feature request" label
- Describe the feature and its benefits
- Explain how it would improve the user experience

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/janasena-event-app.git
cd janasena-event-app

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure mobile responsiveness

#### Testing
- Test on multiple devices and browsers
- Verify offline functionality works
- Check map loading and navigation
- Test all contact/calling features

#### Pull Request Process
1. Update documentation if needed
2. Ensure all tests pass
3. Update the README if you've added features
4. Request review from maintainers

## 📋 Development Guidelines

### Component Structure
- Keep components focused and reusable
- Use proper prop types
- Handle loading and error states
- Implement proper accessibility

### Data Management
- Use the DataService for all data operations
- Implement proper error handling
- Cache data appropriately for offline use

### Mobile Considerations
- Test on actual mobile devices
- Ensure touch targets are appropriately sized
- Optimize for various screen sizes
- Consider network connectivity issues

## 🐛 Bug Reports

When reporting bugs, please include:
- Device/browser information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors (if any)

## 💡 Feature Requests

For new features, consider:
- User benefit and use case
- Implementation complexity
- Impact on existing functionality
- Mobile-first approach

## 📞 Contact

For questions about contributing:
- Open an issue for discussion
- Contact maintainers through GitHub

## 🙏 Recognition

Contributors will be acknowledged in:
- README.md file
- Release notes
- Special thanks section

Thank you for helping make this event app better for everyone!