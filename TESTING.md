# Testing Guide for MicroBlog

Complete testing setup for both backend and frontend applications.

## Backend Testing

### Setup

Install testing dependencies:
```bash
cd backend
npm install --save-dev jest supertest
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Test Files

Located in `backend/tests/`:

1. **auth.test.js** - Authentication endpoints
   - User registration validation
   - Login validation
   - Missing field handling

2. **posts.test.js** - Posts & replies endpoints
   - Feed retrieval
   - Post creation (with & without auth)
   - Like functionality
   - Reply functionality

### What's Tested

✅ API endpoint responses
✅ Authentication requirements
✅ Input validation
✅ Error handling
✅ HTTP status codes
✅ Character limit validation

### Example Test

```javascript
describe('Auth Routes', () => {
  it('should register a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

---

## Frontend Testing

### Setup

Install testing dependencies (already included with create-react-app):
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Files

Located in `frontend/src/__tests__/`:

1. **Login.test.js** - Login/Register component
   - Form rendering
   - Toggle between login and register
   - Error handling
   - Field validation

2. **Post.test.js** - Post display component
   - Post content rendering
   - Like/reply counts
   - Button functionality
   - Relative time display

3. **PostComposer.test.js** - Post creation component
   - Form rendering
   - Character counter
   - Submit button state
   - Character limit enforcement

### What's Tested

✅ Component rendering
✅ User interactions (clicks, typing)
✅ Form validation
✅ Button states
✅ Character counter logic
✅ Reply form toggle

### Example Test

```javascript
describe('PostComposer Component', () => {
  it('displays character counter', () => {
    render(<PostComposer onPostCreated={mockCallback} />);
    expect(screen.getByText('280')).toBeInTheDocument();
  });

  it('updates counter as user types', () => {
    const textarea = screen.getByPlaceholderText(/What's happening/);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('275')).toBeInTheDocument();
  });
});
```

---

## Running All Tests

### Quick Test All

```bash
# Terminal 1: Backend tests
cd backend && npm test

# Terminal 2: Frontend tests (in another terminal)
cd frontend && npm test
```

### Continuous Testing

```bash
# Watch mode for backend
cd backend && npm run test:watch

# Watch mode for frontend (new terminal)
cd frontend && npm test -- --watch
```

---

## Coverage Reports

### Backend

```bash
cd backend
npm test -- --coverage
```

Generates coverage in `backend/coverage/` directory.

### Frontend

```bash
cd frontend
npm test -- --coverage
```

Generates coverage report in terminal.

---

## Test Scenarios

### Backend Test Scenarios

1. **Registration**
   - Valid registration
   - Missing fields
   - Duplicate username

2. **Authentication**
   - Valid login
   - Invalid credentials
   - Missing username/password

3. **Posts**
   - Create post (authenticated)
   - Create post (unauthenticated) → should fail
   - Post with empty content → should fail
   - Post exceeding character limit → should fail

4. **Likes**
   - Like post (authenticated)
   - Like post (unauthenticated) → should fail

5. **Replies**
   - Reply to post (authenticated)
   - Reply to post (unauthenticated) → should fail

### Frontend Test Scenarios

1. **Login Component**
   - Form displays
   - Toggle login/register
   - Submit with valid data
   - Error messages
   - Field validation

2. **Post Component**
   - Post renders correctly
   - Like button works
   - Reply button toggles form
   - Counts display

3. **PostComposer**
   - Textarea accepts input
   - Character counter updates
   - Button disabled when empty
   - 280 character limit enforced

---

## Debugging Tests

### Backend

```bash
# Run single test file
npm test -- tests/auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should register"

# Verbose output
npm test -- --verbose
```

### Frontend

```bash
# Run single test file
npm test -- Login.test.js

# Run tests in browser
npm test -- --coverage=false

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## CI/CD Integration

### Add to package.json

```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

---

## Test Maintenance

### Adding New Tests

1. Create test file in appropriate `__tests__` directory
2. Name file `ComponentName.test.js`
3. Import component and testing utilities
4. Write descriptive test cases
5. Run tests to verify

### Updating Tests

When modifying components:
1. Update corresponding test file
2. Run `npm test -- --watch`
3. Fix failing tests
4. Ensure all tests pass

### Best Practices

- ✅ Write tests for user interactions
- ✅ Test error cases
- ✅ Use descriptive test names
- ✅ Keep tests focused and simple
- ✅ Mock external dependencies
- ✅ Test accessibility
- ✅ Avoid implementation details

---

## Common Issues

### Backend

**Issue**: Tests fail with "Cannot find module"
**Solution**: Ensure `.env` file exists in backend directory

**Issue**: Tests hang or timeout
**Solution**: Add `--detectOpenHandles` to jest command

### Frontend

**Issue**: Tests fail with "Cannot find module '@testing-library/react'"
**Solution**: Run `npm install --save-dev @testing-library/react @testing-library/jest-dom`

**Issue**: Tests pass locally but fail in CI
**Solution**: Check for hardcoded paths or environment dependencies

---

## Resources

### Backend Testing
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

### Frontend Testing
- [React Testing Library](https://testing-library.com/react)
- [Jest Testing Framework](https://jestjs.io/)

---

## Next Steps

1. Install testing dependencies
2. Run existing tests: `npm test`
3. View coverage reports
4. Write additional tests for new features
5. Integrate with CI/CD pipeline

---

**Happy Testing!** 🧪
