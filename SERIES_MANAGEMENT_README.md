# Series Management System

A comprehensive series management system for the Capital Academy admin dashboard, built with React, Node.js, and MongoDB.

## Overview

The Series Management System allows administrators to:
- Create and manage educational series (e.g., MDCAT Series 2025)
- Add tests to series with different modes (Exam/Practice)
- Manage student enrollments
- Track payments and revenue
- Monitor progress and statistics

## System Architecture

### Backend Models

#### 1. Series Model (`models/series/series.js`)
```javascript
{
  slug: String,           // Unique identifier (e.g., 'mdcat-series-2025')
  title: String,          // Series title
  coverImageUrl: String,  // Cover image URL
  description: String,    // Series description
  subjects: [String],     // Array of subjects (Biology, Chemistry, etc.)
  difficulty: String,     // Beginner, Intermediate, Advanced
  price: Number,          // Price in PKR
  originalPrice: Number,  // Original price for discounts
  isActive: Boolean,      // Series availability
  tags: [String],         // Search tags
  totalTests: Number,     // Total number of tests
  totalDurationMin: Number, // Total duration in minutes
  ratings: {              // Rating system
    count: Number,
    average: Number
  },
  createdBy: ObjectId,    // Admin who created
  expiresAt: Date         // Series expiry date
}
```

#### 2. Test Model (`models/series/test.js`)
```javascript
{
  seriesId: ObjectId,     // Reference to Series
  title: String,          // Test title
  description: String,    // Test description
  subjects: [String],     // Subjects covered
  mode: String,           // 'Exam' or 'Practice'
  durationMin: Number,    // Duration in minutes
  totalMarks: Number,     // Total marks
  availability: {         // Test availability window
    startAt: Date,
    endAt: Date
  },
  questions: [{           // Questions array
    questionId: ObjectId, // Reference to MCQ
    marks: Number         // Marks for this question
  }],
  isPublished: Boolean,   // Test visibility
  createdBy: ObjectId     // Admin who created
}
```

#### 3. Enrollment Model (`models/series/enrollments.js`)
```javascript
{
  userId: ObjectId,       // Student reference
  seriesId: ObjectId,     // Series reference
  activatedAt: Date,      // Enrollment activation date
  expiresAt: Date,        // Optional expiry date
  sourceOrderId: ObjectId, // Payment reference
  progress: {             // Student progress
    testsAttempted: Number,
    avgScore: Number,
    lastAttemptAt: Date
  }
}
```

#### 4. Payment Model (`models/series/orders.js`)
```javascript
{
  userId: ObjectId,       // Student reference
  seriesId: ObjectId,     // Series reference
  currency: String,       // 'PKR'
  amount: Number,         // Payment amount
  couponCode: String,     // Applied coupon
  discountApplied: Number, // Discount amount
  status: String,         // created, processing, paid, failed, canceled, refunded
  provider: String,       // 'stripe' or 'manual'
  providerRef: String     // Payment provider reference
}
```

### API Endpoints

#### Series Management
- `GET /series/all` - Get all series
- `GET /series/:id` - Get specific series
- `POST /series` - Create new series
- `PUT /series/:id` - Update series
- `DELETE /series/:id` - Delete series
- `GET /series/:id/stats` - Get series statistics

#### Test Management
- `GET /tests/series/:seriesId` - Get tests for a series
- `GET /tests/:id` - Get specific test
- `POST /tests` - Create new test
- `PUT /tests/:id` - Update test
- `DELETE /tests/:id` - Delete test
- `PATCH /tests/:id/publish` - Publish/unpublish test
- `GET /tests/:id/stats` - Get test statistics

#### Enrollment Management
- `GET /enrollments/all` - Get all enrollments
- `GET /enrollments/series/:seriesId` - Get enrollments for a series
- `GET /enrollments/user/:userId` - Get enrollments for a user
- `POST /enrollments` - Create new enrollment
- `PUT /enrollments/:id` - Update enrollment
- `DELETE /enrollments/:id` - Delete enrollment
- `GET /enrollments/stats/overview` - Get enrollment statistics

#### Payment Management
- `GET /payments/all` - Get all payments
- `GET /payments/series/:seriesId` - Get payments for a series
- `GET /payments/user/:userId` - Get payments for a user
- `POST /payments` - Create new payment
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment
- `PATCH /payments/:id/status` - Update payment status
- `GET /payments/stats/overview` - Get payment statistics
- `GET /payments/stats/revenue-by-series` - Get revenue by series

### Frontend Components

#### 1. SeriesManagement Component
- **Location**: `client/src/admin/components/series/SeriesManagement.jsx`
- **Features**:
  - Create, edit, and delete series
  - View series statistics
  - Manage series details (title, description, subjects, pricing)
  - Series status management (active/inactive)
  - Image upload support
  - Tag management

#### 2. TestManagement Component
- **Location**: `client/src/admin/components/series/TestManagement.jsx`
- **Features**:
  - Create, edit, and delete tests within series
  - Test mode selection (Exam/Practice)
  - Subject assignment
  - Duration and marks configuration
  - Availability window setting
  - Publish/unpublish functionality
  - Test statistics

#### 3. EnrollmentManagement Component
- **Location**: `client/src/admin/components/series/EnrollmentManagement.jsx`
- **Features**:
  - Manage student enrollments
  - View enrollment progress
  - Track test attempts and scores
  - Enrollment expiry management
  - Filter enrollments by series
  - Enrollment statistics

#### 4. PaymentManagement Component
- **Location**: `client/src/admin/components/series/PaymentManagement.jsx`
- **Features**:
  - Track all payments
  - Payment status management
  - Revenue analytics
  - Coupon and discount tracking
  - Payment provider integration
  - Financial reporting

### Admin Dashboard Integration

#### Sidebar Navigation
The series management system is integrated into the admin dashboard sidebar with the following structure:

```
Series Management
├── Manage Series
├── Manage Tests
├── Manage Enrollments
└── Manage Payments
```

#### Routes Configuration
All series management routes are configured in `client/src/routes.jsx`:

```javascript
{
  path: "series",
  element: <SeriesManagement />
},
{
  path: "tests", 
  element: <TestManagement />
},
{
  path: "enrollments",
  element: <EnrollmentManagement />
},
{
  path: "payments",
  element: <PaymentManagement />
}
```

## Features

### 1. Series Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Rich Content**: Support for cover images, descriptions, and tags
- **Pricing**: Flexible pricing with original price for discounts
- **Subject Management**: Multi-subject series support
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Expiry Management**: Optional series expiry dates
- **Statistics**: Revenue, enrollment, and performance metrics

### 2. Test Management
- **Test Types**: Support for both Exam and Practice modes
- **Question Integration**: Link to existing MCQ database
- **Scheduling**: Set availability windows for tests
- **Publishing Control**: Draft/Published status management
- **Subject Coverage**: Assign multiple subjects per test
- **Scoring**: Configurable marks per question

### 3. Enrollment Management
- **Student Tracking**: Monitor individual student progress
- **Progress Analytics**: Test attempts, average scores, last activity
- **Expiry Control**: Optional enrollment expiry dates
- **Bulk Operations**: Manage multiple enrollments
- **Filtering**: Filter by series, user, or status

### 4. Payment Management
- **Payment Tracking**: Complete payment lifecycle management
- **Status Management**: Multiple payment statuses
- **Provider Integration**: Support for multiple payment providers
- **Discount System**: Coupon codes and discount tracking
- **Revenue Analytics**: Detailed financial reporting
- **Series-based Filtering**: View payments by series

## Usage Examples

### Creating a New Series
1. Navigate to "Series Management" → "Manage Series"
2. Click "Add New Series"
3. Fill in the required fields:
   - Slug: `mdcat-series-2025`
   - Title: `MDCAT Complete Series 2025`
   - Description: `Comprehensive MDCAT preparation series`
   - Subjects: Select Biology, Chemistry, Physics, English
   - Price: `5000`
   - Total Tests: `20`
4. Click "Create"

### Adding Tests to a Series
1. Navigate to "Series Management" → "Manage Tests"
2. Select the series from the dropdown
3. Click "Add New Test"
4. Configure test details:
   - Title: `Biology Test 1`
   - Mode: `Practice`
   - Duration: `60` minutes
   - Total Marks: `100`
   - Subjects: `Biology`
5. Click "Create"

### Managing Enrollments
1. Navigate to "Series Management" → "Manage Enrollments"
2. Click "Add New Enrollment"
3. Select student and series
4. Set activation and optional expiry dates
5. Click "Create"

### Tracking Payments
1. Navigate to "Series Management" → "Manage Payments"
2. View payment statistics and revenue
3. Filter payments by series or status
4. Update payment statuses as needed

## Technical Implementation

### Database Indexes
The system includes optimized database indexes for performance:

```javascript
// Enrollment indexes
enrollmentSchema.index({ userId: 1, seriesId: 1 }, { unique: true });
enrollmentSchema.index({ "progress.lastAttemptAt": -1 });

// Series indexes
seriesSchema.index({ slug: 1 }, { unique: true });
seriesSchema.index({ isActive: 1 });
```

### Error Handling
Comprehensive error handling with user-friendly messages:
- Validation errors for required fields
- Duplicate entry prevention
- Database constraint violations
- Network error handling

### State Management
- React hooks for local state management
- Real-time data updates
- Optimistic UI updates
- Loading states and error handling

### UI/UX Features
- Material-UI components for consistent design
- Responsive layout for all screen sizes
- Interactive data tables with sorting and filtering
- Modal dialogs for detailed views and editing
- Progress indicators and loading states
- Success/error notifications using Snackbar

## Security Considerations

1. **Authentication**: All admin routes require authentication
2. **Authorization**: Only admin users can access series management
3. **Input Validation**: Server-side validation for all inputs
4. **Data Sanitization**: Proper sanitization of user inputs
5. **CSRF Protection**: Built-in CSRF protection
6. **Rate Limiting**: API rate limiting for abuse prevention

## Performance Optimizations

1. **Database Indexing**: Optimized indexes for common queries
2. **Pagination**: Large datasets are paginated
3. **Lazy Loading**: Components are lazy-loaded for faster initial load
4. **Caching**: Appropriate caching strategies
5. **Optimistic Updates**: UI updates immediately for better UX

## Future Enhancements

1. **Bulk Operations**: Import/export functionality
2. **Advanced Analytics**: Detailed performance analytics
3. **Notification System**: Email/SMS notifications
4. **API Documentation**: Swagger/OpenAPI documentation
5. **Mobile App**: Native mobile application
6. **Advanced Reporting**: Custom report generation
7. **Integration**: Third-party LMS integration

## Troubleshooting

### Common Issues

1. **Series not appearing**: Check if series is marked as active
2. **Tests not showing**: Verify test is published and within availability window
3. **Enrollment errors**: Ensure user and series exist
4. **Payment issues**: Check payment status and provider configuration

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=series:*
```

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
