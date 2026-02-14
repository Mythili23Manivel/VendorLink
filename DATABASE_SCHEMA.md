# Database Schema

## Users

| Field    | Type   | Required | Notes                    |
|----------|--------|----------|--------------------------|
| name     | String | Yes      |                          |
| email    | String | Yes      | Unique, lowercase        |
| password | String | Yes      | Hashed (bcrypt), min 6   |
| role     | String | Yes      | Admin, ProcurementOfficer|
| timestamps |      |          | createdAt, updatedAt     |

## Vendors

| Field           | Type   | Required | Notes                    |
|-----------------|--------|----------|--------------------------|
| name            | String | Yes      |                          |
| email           | String | Yes      |                          |
| contact         | String | No       |                          |
| totalOrders     | Number | No       | Default 0                |
| onTimeDeliveries| Number | No       | Default 0                |
| rating          | Number | No       | 0-5, default 0           |
| mismatchRate    | Number | No       | 0-100%, default 0        |
| delayRate       | Number | No       | 0-100%, default 0        |
| timestamps      |        |          |                          |

Indexes: name, email (text), rating, mismatchRate, delayRate

## PurchaseOrders

| Field      | Type     | Required | Notes                    |
|------------|----------|----------|--------------------------|
| vendorId   | ObjectId | Yes      | Ref: Vendor              |
| items      | Array    | Yes      | [{description, quantity, unitPrice}] |
| totalAmount| Number   | Yes      |                          |
| status     | String   | Yes      | Pending, Approved, Completed |
| timestamps |          |          |                          |

Indexes: vendorId, status, createdAt

## Invoices

| Field             | Type     | Required | Notes                    |
|-------------------|----------|----------|--------------------------|
| vendorId          | ObjectId | Yes      | Ref: Vendor              |
| purchaseOrderId   | ObjectId | Yes      | Ref: PurchaseOrder       |
| invoiceAmount     | Number   | Yes      |                          |
| matched           | Boolean  | No       | Auto-calculated (≤5% diff) |
| mismatchPercentage| Number   | No       | Auto-calculated          |
| timestamps        |          |          |                          |

Indexes: vendorId, purchaseOrderId, matched

## Payments

| Field    | Type     | Required | Notes                    |
|----------|----------|----------|--------------------------|
| vendorId | ObjectId | Yes      | Ref: Vendor              |
| invoiceId| ObjectId | Yes      | Ref: Invoice             |
| amount   | Number   | Yes      |                          |
| status   | String   | Yes      | Pending, Paid, Overdue   |
| dueDate  | Date     | Yes      |                          |
| paidDate | Date     | No       | Set when marked paid     |
| timestamps|         |          |                          |

Indexes: vendorId, status, dueDate
