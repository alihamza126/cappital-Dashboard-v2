# Series MCQ Feature

This document explains the new Series MCQ feature that allows creating MCQs specifically for series.

## Overview

The Series MCQ feature allows administrators to:
- Create MCQs that are specifically linked to a series
- Filter MCQs by whether they are series-specific or regular MCQs
- Ensure series MCQs are only available for the specific series they belong to

## Database Schema Changes

### MCQ Model Updates

Added new fields to the MCQ schema:

```javascript
{
  // ... existing fields ...
  isSeries: {
    type: Boolean,
    default: false
  },
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    required: function() {
      return this.isSeries === true;
    }
  }
}
```

### Field Descriptions

- **`isSeries`**: Boolean flag indicating if the MCQ is series-specific
- **`seriesId`**: Reference to the Series model (required when `isSeries` is true)

## Frontend Features

### MCQ Management Component

#### New Form Fields
- **Series MCQ Toggle**: Switch to enable/disable series MCQ mode
- **Series Selection**: Dropdown to select the specific series (only shown when Series MCQ is enabled)

#### Filtering Options
- **Series MCQ Filter**: Filter MCQs by:
  - All MCQs (default)
  - Series MCQs Only
  - Regular MCQs Only

#### Table Display
- **Series MCQ Column**: Shows "Yes" or "No" for each MCQ
- **Series Information**: Displays series name for series MCQs

### Form Validation

- When `isSeries` is true, `seriesId` becomes required
- All existing validation rules still apply

## API Endpoints

### MCQ Creation
```javascript
POST /mcq/add
{
  // ... existing fields ...
  isSeries: true,
  seriesId: "series_object_id"
}
```

### MCQ Update
```javascript
PUT /mcq/update
{
  id: "mcq_id",
  formData: {
    // ... existing fields ...
    isSeries: true,
    seriesId: "series_object_id"
  }
}
```

### MCQ Retrieval
The existing `/mcq/get` endpoint works with the new fields. Series MCQs can be filtered by:
- Subject, chapter, topic (existing filters)
- Course (existing filter)
- Series-specific filtering (new)

## Usage Examples

### Creating a Series MCQ

1. **Navigate to MCQ Management**
   - Go to Admin Dashboard → Series Management → Manage MCQs

2. **Add New MCQ**
   - Click "Add New MCQ"
   - Fill in basic MCQ details (question, options, etc.)

3. **Enable Series MCQ**
   - Toggle the "Series MCQ" switch to ON
   - Select the specific series from the dropdown

4. **Save MCQ**
   - The MCQ will be linked to the selected series

### Filtering Series MCQs

1. **Use Series MCQ Filter**
   - In the filters section, select "Series MCQs Only"
   - This will show only MCQs that are linked to series

2. **View Series Information**
   - Series MCQs will show "Yes" in the Series MCQ column
   - Series name is displayed in the MCQ details

### Managing Series MCQs

- **Edit**: Series MCQs can be edited to change the linked series
- **Delete**: Series MCQs can be deleted like regular MCQs
- **View**: Series information is shown in the MCQ details dialog

## Benefits

### For Administrators
- **Better Organization**: MCQs can be organized by series
- **Targeted Content**: Create series-specific question banks
- **Easy Management**: Filter and manage MCQs by series

### For Students
- **Series-Specific Tests**: Tests can include only series-specific MCQs
- **Better Learning**: Focused content for specific series
- **Progress Tracking**: Track progress within specific series

## Integration with Test Management

When creating tests for series:
1. **MCQ Selection**: Only series-specific MCQs will be available for selection
2. **Quality Control**: Ensures tests contain relevant MCQs for the series
3. **Consistency**: Maintains series-specific content standards

## Migration Notes

### Existing MCQs
- All existing MCQs will have `isSeries: false` by default
- No migration required for existing data
- Existing MCQs continue to work as before

### Backward Compatibility
- All existing API endpoints continue to work
- Existing MCQ retrieval logic is unchanged
- Series MCQs are an additional feature, not a replacement

## Future Enhancements

### Planned Features
- **Series MCQ Statistics**: Track usage of series MCQs
- **Bulk Operations**: Bulk assign MCQs to series
- **Series MCQ Templates**: Pre-defined MCQ templates for series
- **Advanced Filtering**: Filter by multiple series

### Potential Improvements
- **Series MCQ Analytics**: Detailed analytics for series MCQs
- **Series MCQ Recommendations**: AI-powered MCQ recommendations
- **Series MCQ Sharing**: Share MCQs between series

## Troubleshooting

### Common Issues

1. **Series MCQ Not Saving**
   - Ensure series is selected when `isSeries` is true
   - Check that the series exists in the database

2. **Series MCQ Not Showing**
   - Verify the series MCQ filter is set correctly
   - Check that the MCQ has `isSeries: true`

3. **Series Information Missing**
   - Ensure the series still exists in the database
   - Check the `seriesId` reference is valid

### Debug Mode
Enable debug logging to troubleshoot series MCQ issues:
```bash
DEBUG=mcq:series:*
```

## Support

For technical support or feature requests related to Series MCQs, please contact the development team or create an issue in the project repository.
