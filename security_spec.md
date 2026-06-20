# Security Specification: Vital Twin Network

This document defines the security rules and data integrity boundaries for the **Vital Twin Network** on Google Firebase (Firestore and Authentication).

---

## 1. Data Invariants
1. **User Ownership Isolation**: Users can only read and write their own User Profile, Credentials, Consents, Records, and Transactions.
2. **Authenticity Constraint**: Writing any document in `/users/{userId}` requires that the `userId` matches the authenticated `request.auth.uid`.
3. **Role Lockdown**: Initial user sign-up allows selecting user roles, but subsequent updates to roles are forbidden from the client side.
4. **Veracity of Timestamps**: Client-provided timestamps cannot bypass server clocks where server-enforced validation is applicable.

---

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads constitute attacks trying to bypass security constraints. Every one of these MUST yield a `PERMISSION_DENIED` result on the server side:

1. **Spoofed User Registration**: Attempting to register profile for `/users/attacker_uid` as `victim_uid`'s ID.
2. **Self-Promoting Admin Role**: Attempting to update role to "ADMIN" on user profile `/users/patient_id`.
3. **Foreign Record Reading**: Attempting to query records where `userId == 'victim_id'` from a different user's session.
4. **Record Hijacking**: Submitting a new record with `userId` set to a different patient to poison their charts.
5. **Pre-Dated Record Creation**: Submitting records with far-future custom `timestamp` values to scramble order.
6. **Privilege Escalation in Credentials**: Setting extra gas or high balance/credits via direct credential patch.
7. **Bypassing Signature Keys**: Writing empty or missing signature keys in Sovereign Credentials.
8. **Malicious Consent injection**: Writing consent grants on behalf of a victim patient nodes.
9. **Rogue Block Transaction injection**: Creating fake financial/gas usage logs indicating system costs that did not happen.
10. **Admin Bypass Attack**: Authenticating as general patient but attempting to modify system parameters inside Admin/Fraud databases.
11. **Impersonate Doctor signature**: Attempting to insert a medical record with doctor signature details by a general patient without verified authorization.
12. **Orphaned Record Creation**: Creating records with nonsense layout formats or excessively long strings exceeding limits.

---

## 3. Test Runner Setup
The validation rules in `/firestore.rules` will enforce matching protections.

Below is an abstract design of our verification criteria:
- Every read block checks that request `auth.uid` is not null and matches `resource.data.userId` or `id`.
- Every write checks that incoming `userId == request.auth.uid`.
- Non-owner interactions are blocked by default.
