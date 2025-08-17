# MCQ Integration Guide

This guide explains how to integrate MCQs with the Series Management System in the Capital Academy admin dashboard.

## Overview

The MCQ integration allows administrators to:
- Select existing MCQs from the database to add to tests
- Filter MCQs by subject, chapter, topic, difficulty, and course
- Search MCQs by question text
- Bulk select/deselect MCQs
- View MCQ details including correct answers and explanations

## How to Use

### 1. Creating a Test with MCQs

1. **Navigate to Test Management**
   - Go to Admin Dashboard
   - Click "Series Management" → "Manage Tests"
   - Select a series from the dropdown

2. **Create New Test**
   - Click "Add New Test"
   - Fill in basic test details (title, description, subjects, etc.)
   - Switch to the "MCQ Selection" tab

3. **Add MCQs to Test**
   - Click "Add MCQs" button
   - Use the MCQ Selector dialog to choose questions:
     - **Search**: Type to search by question text, subject, or chapter
     - **Filters**: Use subject, chapter, topic, difficulty, and course filters
     - **Select**: Check the boxes next to MCQs you want to add
     - **Bulk Actions**: Use "Select All" or "Deselect All" for bulk operations

4. **Save Test**
   - Review selected MCQs in the list
   - Click "Create" to save the test with selected MCQs

### 2. MCQ Selector Features

#### Search Functionality
- **Text Search**: Search by question content, subject, or chapter
- **Real-time Filtering**: Results update as you type

#### Filter Options
- **Subject**: Biology, Chemistry, Physics, English, Mathematics, Logic
- **Chapter**: Subject-specific chapters (e.g., Cell Biology, Organic Chemistry)
- **Topic**: Specific topics within chapters
- **Difficulty**: Easy, Medium, Hard
- **Course**: MDCAT, NUMS

#### MCQ Display
Each MCQ shows:
- **Question Text**: Full question content
- **Options**: All answer choices (A, B, C, D)
- **Correct Answer**: Highlighted in green and bold
- **Metadata**: Subject, chapter, difficulty, topic
- **Explanation**: If available (not "Explanation Not provided")

#### Selection Features
- **Individual Selection**: Check/uncheck individual MCQs
- **Bulk Selection**: Select all visible MCQs
- **Bulk Deselection**: Deselect all visible MCQs
- **Selection Counter**: Shows how many MCQs are selected

### 3. MCQ Database Structure

The MCQ model includes:
```javascript
{
  question: String,           // Question text
  options: [String],         // Array of answer choices
  correctOption: Number,     // Index of correct answer (0-3)
  difficulty: String,        // 'easy', 'medium', 'hard'
  subject: String,          // 'biology', 'chemistry', 'physics', 'english', 'logic'
  chapter: String,          // Chapter name
  category: String,         // 'past', 'normal'
  topic: String,           // Topic within chapter
  course: String,          // 'mdcat', 'nums'
  info: String,            // Additional information
  explain: String,         // Explanation for correct answer
  imageUrl: String         // Optional image URL
}
```

### 4. Test-MCQ Relationship

When MCQs are added to a test, they are stored as:
```javascript
{
  questions: [
    {
      questionId: ObjectId,  // Reference to MCQ document
      marks: Number          // Marks for this question (default: 1)
    }
  ]
}
```

### 5. API Endpoints

#### MCQ Retrieval
- `POST /mcq/get` - Get MCQs with filters
  ```javascript
  {
    course: 'mdcat',
    subject: 'biology',
    chapter: 'Cell Biology',
    topic: 'Cell Structure',
    catagory: 'all'
  }
  ```

#### Test Management
- `GET /tests/series/:seriesId` - Get all tests for a series
- `POST /tests` - Create new test with MCQs
- `PUT /tests/:id` - Update test and MCQs
- `GET /tests/:id` - Get single test with populated MCQs

### 6. Best Practices

#### MCQ Selection
1. **Start with Subject Filter**: Filter by the main subject first
2. **Use Chapter Filter**: Narrow down to specific chapters
3. **Consider Difficulty**: Mix easy, medium, and hard questions
4. **Check Explanations**: Prefer MCQs with good explanations
5. **Balance Topics**: Ensure coverage across different topics

#### Test Creation
1. **Plan Question Count**: Consider test duration and total marks
2. **Mix Question Types**: Include different difficulty levels
3. **Subject Coverage**: Ensure all test subjects are represented
4. **Review Questions**: Check selected MCQs before saving

#### Performance Tips
1. **Use Filters**: Apply filters to reduce the number of MCQs to browse
2. **Search Efficiently**: Use specific keywords in search
3. **Bulk Operations**: Use select all/deselect all for large selections
4. **Save Regularly**: Save tests frequently to avoid losing work

### 7. Troubleshooting

#### Common Issues

1. **No MCQs Found**
   - Check if filters are too restrictive
   - Try removing some filters
   - Verify MCQ data exists in database

2. **MCQ Selection Not Working**
   - Refresh the page
   - Check browser console for errors
   - Verify MCQ IDs are valid

3. **Test Not Saving**
   - Ensure at least one MCQ is selected
   - Check all required fields are filled
   - Verify series exists

4. **MCQ Display Issues**
   - Check MCQ data structure
   - Verify populate queries are working
   - Check for missing MCQ documents

#### Debug Mode
Enable debug logging to troubleshoot issues:
```bash
DEBUG=mcq:*
```

### 8. Future Enhancements

Planned improvements:
- **MCQ Preview**: Preview MCQs before adding to test
- **Question Bank Management**: Direct MCQ management from test interface
- **Import/Export**: Bulk import MCQs from files
- **Advanced Search**: More sophisticated search options
- **Question Statistics**: View MCQ usage statistics
- **Duplicate Detection**: Prevent adding duplicate MCQs to tests

## Support

For technical support or feature requests related to MCQ integration, please contact the development team or create an issue in the project repository.
