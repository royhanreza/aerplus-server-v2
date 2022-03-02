# API Documentations

## Employees

### Get Employee Detail

URL

    GET /api/employees/{id}

### Get Attendances

URL (Without pagination)

    GET /api/employees/{id}/attendances

URL (With Pagination)

    GET /api/employees/{id}/attendances?pagination=true&page=1&per_page=2&start_date=2022-02-01&end_date=2022-02-02

### Get Active Leave (Sisa Cuti) [NEW!]

Note: Sisa cuti = total leave - taken leave
URL

    GET /api/employees/{id}/active-leave

Reponse Example:

    {
        "data": {
            "id": 1,
            "employeeId": 9,
            "startDate": "2022-01-01",
            "endDate": "2022-12-31",
            "totalLeave": 12,
            "takenLeave": 10,
            "active": true,
            "createdAt": "2022-03-02T20:04:12.000Z",
            "updatedAt": "2022-03-02T20:13:34.000Z"
        }
    }

## Attendances

### Checkin / Clockin

URL

    POST /api/attendances/action/clockin

Request Example:

    {
        employee_id:  1,
        date:  "2022-02-02",
        clock_in:  "08:00",
        clock_in_at:  "2022-02-02 08:00",
        clock_in_ip_address:  "102.168.23.23",
        clock_in_device_detail:  "Redmi note 2",
        clock_in_latitude:  "-6.4535345",
        clock_in_longitude:  "102.312323",
        clock_in_office_latitude:  "-6.4535345",
        clock_in_office_longitude:  "102.123213",
        note:  "this is note",
        attachment: File/Image
    }

### Checkout / Clockout

URL

    POST /api/attendances/action/clockout

Request Example

    {
        employee_id:  1,
        date:  "2022-02-02",
        clock_out:  "08:00",
        clock_out_at:  "2022-02-02 08:00",
        clock_out_ip_address:  "102.168.23.23",
        clock_out_device_detail:  "Redmi note 2",
        clock_out_latitude:  "-6.4535345",
        clock_out_longitude:  "102.312323",
        clock_out_office_latitude:  "-6.4535345",
        clock_out_office_longitude:  "102.123213",
        note:  "this is note",
        attachment: File/Image
    }

## Auth

### Mobile Sign In (Regular Employee)

URL

    POST /api/hrd-auth/mobile/signin/admin

Request Example

    {
        "username": "eza",
        "password": "123456789"
    }

Response Example

    {
        "message": "sign in successfully",
        "code": 200,
        "error": false,
        "data": {
            "id": 9,
            "employeeId": "D001",
            "name": "Fauzi",
            "email": "fauzi@gmail.com",
            "handphone": "089123",
            "placeOfBirth": "Bekasi",
            "birthDate": "2022-02-11",
            "gender": "male",
            "maritalStatus": "lajang",
            "bloodType": "a",
            "religion": "islam",
            "identityType": "ktp",
            "identityNumber": "0872323",
            "identityExpiryDate": "2022-02-11",
            "identityAddress": "bogot ",
            "postalCode": "2323",
            "residentialAddress": "bogor",
            "photo": null,
            "createdAt": "2022-02-11T07:33:47.000Z",
            "updatedAt": "2022-02-11T07:33:47.000Z",
            "career": {
                "id": 3,
                "employeeId": 9,
                "employmentStatus": "Karyawan Tetap Permanen",
                "type": "Baru Direkrut",
                "designationId": 2,
                "departmentId": 2,
                "jobTitleId": 1,
                "effectiveDate": "2022-02-17",
                "endOfEmploymentDate": null,
                "taxMethod": "nett",
                "active": true,
                "createdAt": "2022-02-17T08:04:14.000Z",
                "updatedAt": "2022-02-17T08:04:14.000Z",
                "DepartmentId": 2,
                "DesignationId": 2,
                "EmployeeId": 9,
                "JobTitleId": 1,
                "designation": {
                    "id": 2,
                    "name": "BOD3",
                    "active": false,
                    "createdAt": "2022-02-11T06:45:21.000Z",
                    "updatedAt": "2022-02-11T06:54:29.000Z"
                },
                "department": {
                    "id": 2,
                    "name": "Departemen Cetak",
                    "active": true,
                    "createdAt": "2022-02-17T04:13:12.000Z",
                    "updatedAt": "2022-02-17T04:13:12.000Z"
                },
                "jobTitle": {
                    "id": 1,
                    "name": "Cetak 2",
                    "active": true,
                    "createdAt": "2022-02-11T07:18:19.000Z",
                    "updatedAt": "2022-02-11T07:18:37.000Z"
                }
            }
        }
    }

### Mobile Sign In (Admin)

URL

    POST /api/hrd-auth/mobile/signin/admin

Request Example

    {
        "username": "eza",
        "password": "123456789"
    }
