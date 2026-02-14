# Sample API Requests

Base URL: `http://localhost:5000/api`

## 1. Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ProcurementOfficer"
}
```

## 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@vendorlink.com",
  "password": "admin123"
}
```

Response includes `token`. Use it in subsequent requests:
```
Authorization: Bearer <token>
```

## 3. Create Vendor

```http
POST /vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Supplies",
  "email": "orders@acme.com",
  "contact": "+1-555-1234"
}
```

## 4. Create Purchase Order

```http
POST /purchase-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "<vendor_id>",
  "items": [
    {
      "description": "Office Chairs",
      "quantity": 10,
      "unitPrice": 150
    }
  ],
  "totalAmount": 1500
}
```

## 5. Approve Purchase Order

```http
PUT /purchase-orders/<po_id>/approve
Authorization: Bearer <token>
```

## 6. Create Invoice (auto-matches with PO)

```http
POST /invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "<vendor_id>",
  "purchaseOrderId": "<po_id>",
  "invoiceAmount": 1500
}
```

If invoiceAmount differs from PO totalAmount by >5%, invoice is flagged as mismatched.

## 7. Create Payment

```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "<vendor_id>",
  "invoiceId": "<invoice_id>",
  "amount": 1500,
  "dueDate": "2025-03-15"
}
```

## 8. Mark Payment Paid

```http
PUT /payments/<payment_id>/paid
Authorization: Bearer <token>
```

## 9. Dashboard Analytics

```http
GET /dashboard
Authorization: Bearer <token>
```

## 10. AI Assistant Query

```http
POST /ai-assistant/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Which vendor is high risk?"
}
```
