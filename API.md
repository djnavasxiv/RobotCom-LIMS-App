# API Documentation

## Overview

RobotCom LIMS provides a comprehensive REST API for laboratory operations including patient management, sample tracking, test ordering, and billing.

**API Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api` (development) or `https://api.robotcom.com` (production)

## Authentication

All API requests (except login) require authentication using JWT bearer tokens.

### Login

**Endpoint**: `POST /auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "username": "user@example.com",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "technician"
  }
}
```

**Status Codes**:
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing or invalid parameters

### Authorization Header

Use the returned token in subsequent requests:

```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/patients
```

### Token Expiration

Tokens expire after **24 hours**. Refresh by logging in again.

## Patient Management

### Get Patients List

**Endpoint**: `GET /patients`

**Parameters**:
- `labId` (required) - Laboratory ID
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Results per page
- `search` (optional) - Search by name or phone
- `sortBy` (optional) - Sort field: `firstName`, `lastName`, `phone`, `createdAt`
- `sortOrder` (optional) - Sort order: `asc`, `desc`

**Example**:
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/patients?labId=lab-1&search=Juan&sortBy=lastName&sortOrder=asc"
```

**Response**:
```json
{
  "data": [
    {
      "id": "patient-1",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "phone": "555-1234567",
      "birthDate": "1990-01-15",
      "gender": "male",
      "address": "Calle Principal 123",
      "labId": "lab-1",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Create Patient

**Endpoint**: `POST /patients`

**Request Body**:
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "555-1234567",
  "birthDate": "1990-01-15",
  "gender": "male",
  "address": "Calle Principal 123",
  "labId": "lab-1"
}
```

**Validation Rules**:
- `firstName`: 2-100 characters, alphanumeric + spaces
- `lastName`: 2-100 characters, alphanumeric + spaces
- `phone`: 10-15 digits
- `email`: Valid email format (optional)
- `birthDate`: Valid date, not in future

**Response** (201 Created):
```json
{
  "id": "patient-1",
  "firstName": "Juan",
  "lastName": "Pérez",
  ...
}
```

**Error Responses**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "errors": {
    "firstName": "First name must be 2-100 characters"
  }
}
```

### Get Patient Details

**Endpoint**: `GET /patients/{id}`

```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/patients/patient-1
```

**Response** (200 OK):
```json
{
  "id": "patient-1",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "555-1234567",
  "birthDate": "1990-01-15",
  "gender": "male",
  "address": "Calle Principal 123",
  "samples": [
    {
      "id": "sample-1",
      "sampleNumber": "S-001",
      "status": "pending"
    }
  ],
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### Update Patient

**Endpoint**: `PUT /patients/{id}`

**Request Body**: Same as create patient (all fields optional)

**Response** (200 OK): Updated patient object

### Delete Patient

**Endpoint**: `DELETE /patients/{id}`

**Response** (204 No Content): No body

## Sample Management

### Create Sample

**Endpoint**: `POST /samples`

**Request Body**:
```json
{
  "sampleNumber": "S-001",
  "patientId": "patient-1",
  "profileId": "profile-1",
  "collectionDate": "2024-01-15T10:30:00Z",
  "notes": "Fasting sample"
}
```

**Response** (201 Created):
```json
{
  "id": "sample-1",
  "sampleNumber": "S-001",
  "patientId": "patient-1",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### List Samples

**Endpoint**: `GET /samples`

**Parameters**:
- `patientId` - Filter by patient
- `status` - Filter by status: `pending`, `processing`, `completed`, `rejected`
- `page` - Pagination
- `limit` - Results per page

**Response** (200 OK):
```json
{
  "data": [...],
  "pagination": {...}
}
```

### Update Sample Status

**Endpoint**: `PATCH /samples/{id}/status`

**Request Body**:
```json
{
  "status": "processing"
}
```

**Valid Status Transitions**:
- `pending` → `processing`, `rejected`
- `processing` → `completed`, `rejected`
- `completed` → (no changes)
- `rejected` → (no changes)

## Test Management

### List Tests

**Endpoint**: `GET /tests`

**Parameters**:
- `category` - Filter by category
- `isActive` - Filter by status
- `search` - Search by name or code

**Response**:
```json
{
  "data": [
    {
      "id": "test-1",
      "code": "CBC",
      "name": "Complete Blood Count",
      "price": 150.00,
      "category": "Hematology",
      "unit": "mcL",
      "normalRange": "4,500-11,000",
      "isActive": true
    }
  ]
}
```

### Get Test Details

**Endpoint**: `GET /tests/{id}`

**Response**: Test object with full details

## Invoice Management

### Create Invoice

**Endpoint**: `POST /invoices`

**Request Body**:
```json
{
  "invoiceNumber": "INV-001",
  "patientId": "patient-1",
  "sampleId": "sample-1",
  "items": [
    {
      "testId": "test-1",
      "quantity": 1,
      "unitPrice": 150.00
    }
  ],
  "discountPercent": 0,
  "notes": "Payment due in 30 days"
}
```

**Response** (201 Created):
```json
{
  "id": "invoice-1",
  "invoiceNumber": "INV-001",
  "patientId": "patient-1",
  "sampleId": "sample-1",
  "subtotal": 150.00,
  "tax": 30.00,
  "discount": 0.00,
  "total": 180.00,
  "status": "pending",
  "createdAt": "2024-01-15T14:20:00Z"
}
```

### Get Invoice

**Endpoint**: `GET /invoices/{id}`

### List Invoices

**Endpoint**: `GET /invoices`

**Parameters**:
- `status` - Filter by status: `pending`, `paid`, `cancelled`
- `dateFrom` - Start date
- `dateTo` - End date
- `patientId` - Filter by patient

### Update Invoice Status

**Endpoint**: `PATCH /invoices/{id}/status`

**Request Body**:
```json
{
  "status": "paid",
  "paymentDate": "2024-01-20T10:00:00Z",
  "paymentMethod": "credit_card"
}
```

## Results Management

### Add Test Result

**Endpoint**: `POST /results`

**Request Body**:
```json
{
  "sampleId": "sample-1",
  "testId": "test-1",
  "value": "7500",
  "isNormal": true,
  "notes": "Within normal range",
  "enteredBy": "user-1"
}
```

**Response** (201 Created):
```json
{
  "id": "result-1",
  "sampleId": "sample-1",
  "testId": "test-1",
  "value": "7500",
  "isNormal": true,
  "notes": "Within normal range",
  "enteredBy": "user-1",
  "enteredAt": "2024-01-20T15:30:00Z",
  "createdAt": "2024-01-20T15:30:00Z"
}
```

### Get Sample Results

**Endpoint**: `GET /samples/{id}/results`

**Response**:
```json
{
  "sampleId": "sample-1",
  "results": [
    {
      "id": "result-1",
      "testId": "test-1",
      "testName": "Complete Blood Count",
      "value": "7500",
      "unit": "mcL",
      "normalRange": "4,500-11,000",
      "isNormal": true
    }
  ]
}
```

## Error Handling

All error responses follow this format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Error details"
  },
  "timestamp": "2024-01-20T15:30:00Z"
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Validation Errors

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {
    "firstName": "Must be 2-100 characters",
    "email": "Invalid email format",
    "phone": "Must contain 10-15 digits"
  }
}
```

## Rate Limiting

API is rate-limited to **100 requests per minute** per user.

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

Exceeding limit returns `429 Too Many Requests`.

## Pagination

Paginated endpoints include:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Filtering & Sorting

### Filtering

```bash
# Multiple filters
GET /patients?firstName=Juan&status=active

# Date range
GET /invoices?createdFrom=2024-01-01&createdTo=2024-01-31
```

### Sorting

```bash
# Single sort
GET /patients?sortBy=lastName&sortOrder=asc

# Multiple fields (some endpoints)
GET /patients?sort=-createdAt,firstName
```

## Bulk Operations

### Batch Create Samples

**Endpoint**: `POST /samples/batch`

**Request Body**:
```json
{
  "samples": [
    { "sampleNumber": "S-001", "patientId": "patient-1" },
    { "sampleNumber": "S-002", "patientId": "patient-2" }
  ]
}
```

**Response**:
```json
{
  "created": 2,
  "failed": 0,
  "results": [...]
}
```

## WebSocket Events (Real-time)

Connect to `ws://localhost:3000/ws` for real-time updates.

**Events**:
- `patient:created` - New patient added
- `sample:status_changed` - Sample status updated
- `result:added` - New result entered
- `invoice:paid` - Invoice marked as paid

**Example**:
```javascript
const ws = new WebSocket('ws://localhost:3000/ws?token={bearer_token}');

ws.on('message', (event) => {
  if (event.type === 'sample:status_changed') {
    console.log('Sample status:', event.data);
  }
});
```

## Best Practices

### ✅ Do

- Always validate input before sending
- Use appropriate HTTP methods
- Include Content-Type header
- Handle error responses
- Implement retry logic for transient failures
- Cache responses when appropriate
- Use pagination for large datasets

### ❌ Don't

- Store API tokens in localStorage (use secure storage)
- Make unnecessary API calls
- Ignore error codes and messages
- Log sensitive data
- Send passwords in query parameters
- Exceed rate limits

## SDK/Client Libraries

Official SDKs available:
- JavaScript/TypeScript: `@robotcom/lims-sdk`
- Python: `robotcom-lims-python`
- Java: `com.robotcom.lims:lims-client`

## Support

For API issues:
1. Check this documentation
2. Review error code and message
3. Check API status at https://status.robotcom.com
4. Contact support@robotcom.com
5. Create issue with request/response details

## Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Patients, Samples, Tests, Invoices endpoints
- Authentication and authorization
- Rate limiting and pagination
- Error handling
