# Coding Standards and Best Practices

## General Principles

1. **Consistency**: Follow established patterns throughout the codebase
2. **Readability**: Write self-documenting code with clear variable and function names
3. **Maintainability**: Structure code for easy updates and debugging
4. **Performance**: Consider performance implications of code decisions
5. **Security**: Follow security best practices for all code

## Frontend Standards (React/TypeScript)

### File Structure
- Use PascalCase for component files: `ParkingMap.tsx`
- Use camelCase for utility files: `dateHelpers.ts`
- Use kebab-case for CSS files: `parking-map.css`

### Component Standards
```typescript
// ✅ Good: Functional component with proper typing
interface ParkingMapProps {
  locations: ParkingLocation[];
  onLocationSelect: (location: ParkingLocation) => void;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({ 
  locations, 
  onLocationSelect 
}) => {
  // Component logic
};

// ❌ Bad: No proper typing
export const ParkingMap = ({ locations, onLocationSelect }) => {
  // Component logic
};
```

### State Management
- Use React hooks for local state
- Use Context API for global state
- Avoid prop drilling beyond 2-3 levels

### API Calls
```typescript
// ✅ Good: Proper error handling and typing
const fetchParkingData = async (): Promise<ParkingLocation[]> => {
  try {
    const response = await axios.get<ParkingLocation[]>('/api/v1/parking');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch parking data:', error);
    throw new Error('Unable to load parking information');
  }
};

// ❌ Bad: No error handling or typing
const fetchParkingData = async () => {
  const response = await axios.get('/api/v1/parking');
  return response.data;
};
```

## Backend Standards (Node.js/Express/TypeScript)

### File Structure
- Use camelCase for files: `parkingController.ts`
- Use PascalCase for classes: `ParkingService.ts`
- Group related functionality in modules

### API Design
```typescript
// ✅ Good: Proper route structure with middleware
router.get('/parking/:id', 
  validateParkingId, 
  authMiddleware, 
  getParkingById
);

// ✅ Good: Consistent response format
const sendSuccess = (res: Response, data: any, message?: string) => {
  res.status(200).json({
    success: true,
    message: message || 'Operation successful',
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res: Response, error: any, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
};
```

### Database Operations
```typescript
// ✅ Good: Proper error handling and validation
export const createParkingLocation = async (data: CreateParkingLocationDto): Promise<ParkingLocation> => {
  try {
    const validatedData = await validateParkingData(data);
    const parkingLocation = new ParkingLocationModel(validatedData);
    return await parkingLocation.save();
  } catch (error) {
    logger.error('Failed to create parking location:', error);
    throw new DatabaseError('Unable to create parking location');
  }
};
```

## Data Science Standards (Python)

### File Structure
- Use snake_case for all Python files: `parking_predictor.py`
- Use PascalCase for classes: `ParkingPredictor`
- Use descriptive module names

### Code Organization
```python
# ✅ Good: Proper class structure
class ParkingPredictor:
    """Predicts parking availability using historical data."""
    
    def __init__(self, model_config: Dict[str, Any]) -> None:
        self.model_config = model_config
        self.model = None
        self.scaler = StandardScaler()
    
    def train(self, X_train: pd.DataFrame, y_train: pd.Series) -> None:
        """Train the parking prediction model."""
        try:
            X_scaled = self.scaler.fit_transform(X_train)
            self.model = XGBRegressor(**self.model_config)
            self.model.fit(X_scaled, y_train)
            logger.info("Model training completed successfully")
        except Exception as e:
            logger.error(f"Model training failed: {e}")
            raise ModelTrainingError(f"Failed to train model: {e}")
```

### Data Processing
```python
# ✅ Good: Proper error handling and validation
def clean_parking_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and validate parking sensor data."""
    if df.empty:
        raise ValueError("Input DataFrame is empty")
    
    # Validate required columns
    required_columns = ['timestamp', 'location_id', 'occupancy']
    missing_columns = set(required_columns) - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    # Clean data
    df_clean = df.copy()
    df_clean = df_clean.dropna(subset=required_columns)
    df_clean['timestamp'] = pd.to_datetime(df_clean['timestamp'])
    
    return df_clean
```

## Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(frontend): add real-time parking availability map

- Implement interactive map component using Leaflet
- Add real-time data updates every 30 seconds
- Include filtering by parking type and availability

Closes #123

fix(backend): resolve MongoDB connection timeout issue

- Increase connection timeout to 30 seconds
- Add retry logic for failed connections
- Update error handling for database operations

Fixes #456
```

## Testing Standards

### Frontend Testing
```typescript
// ✅ Good: Comprehensive component test
describe('ParkingMap', () => {
  const mockLocations: ParkingLocation[] = [
    { id: '1', lat: -37.8136, lng: 144.9631, available: 5 }
  ];

  it('renders parking locations correctly', () => {
    render(<ParkingMap locations={mockLocations} onLocationSelect={jest.fn()} />);
    expect(screen.getByTestId('parking-location-1')).toBeInTheDocument();
  });

  it('calls onLocationSelect when location is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<ParkingMap locations={mockLocations} onLocationSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByTestId('parking-location-1'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockLocations[0]);
  });
});
```

### Backend Testing
```typescript
// ✅ Good: API endpoint test
describe('GET /api/v1/parking', () => {
  it('should return parking locations', async () => {
    const response = await request(app)
      .get('/api/v1/parking')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('lat');
    expect(response.body.data[0]).toHaveProperty('lng');
  });

  it('should handle errors gracefully', async () => {
    // Mock database error
    jest.spyOn(ParkingModel, 'find').mockRejectedValue(new Error('DB Error'));

    const response = await request(app)
      .get('/api/v1/parking')
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeTruthy();
  });
});
```

### Python Testing
```python
# ✅ Good: Model testing
class TestParkingPredictor:
    def setup_method(self):
        self.config = {'n_estimators': 100, 'max_depth': 6}
        self.predictor = ParkingPredictor(self.config)
        
    def test_train_with_valid_data(self):
        """Test model training with valid data."""
        X_train = pd.DataFrame({'hour': [9, 10, 11], 'day_of_week': [1, 1, 1]})
        y_train = pd.Series([0.8, 0.9, 0.7])
        
        self.predictor.train(X_train, y_train)
        
        assert self.predictor.model is not None
        assert hasattr(self.predictor.scaler, 'scale_')
        
    def test_train_with_empty_data(self):
        """Test model training fails with empty data."""
        X_train = pd.DataFrame()
        y_train = pd.Series()
        
        with pytest.raises(ModelTrainingError):
            self.predictor.train(X_train, y_train)
```

## Security Standards

### Environment Variables
- Never commit `.env` files
- Use `.env.template` files for documentation
- Validate all environment variables on startup

### API Security
```typescript
// ✅ Good: Input validation and sanitization
const validateParkingLocation = (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.body;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Coordinates must be numbers' });
  }
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }
  
  next();
};
```

### Data Sanitization
```typescript
// ✅ Good: Input sanitization
import validator from 'validator';

const sanitizeUserInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};
```

## Performance Standards

### Frontend Performance
- Use React.memo for expensive components
- Implement virtualization for large lists
- Optimize bundle size with code splitting

### Backend Performance
- Implement caching for frequently accessed data
- Use database indexing appropriately
- Implement rate limiting

### Database Performance
```typescript
// ✅ Good: Efficient query with projection and limit
const getRecentParkingData = async (limit = 100) => {
  return await ParkingModel
    .find({ timestamp: { $gte: new Date(Date.now() - 3600000) } })
    .select('location_id occupancy timestamp')
    .sort({ timestamp: -1 })
    .limit(limit);
};
```

## Code Review Checklist

### Before Submitting PR
- [ ] Code follows established patterns
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Environment variables are templated
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Error handling is implemented
- [ ] Security best practices followed

### During Code Review
- [ ] Logic is correct and efficient
- [ ] Code is readable and well-commented
- [ ] Tests cover edge cases
- [ ] No code duplication
- [ ] Performance considerations addressed
- [ ] Security vulnerabilities checked
- [ ] Breaking changes documented