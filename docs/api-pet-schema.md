# Pet API – Backend schema reference

**Base:** `http://64.225.84.126:8084/api/v1`

---

## Endpoints

### Create/Update Pet Report
`POST /pet/report`

**Request:** `multipart/form-data`
- `petDTO` (Blob): JSON string of pet data (see Pet entity fields below)
- `photos` (File): One or more photo files (primary first when updating)

**petDTO for update (when `id` is set):** Frontend sends `existingMediaIds: number[]` (ids of media to keep) so the backend does not clear `Pet.media` and trigger JPA orphan deletion. Backend should merge: keep media in this list, add new ones from `photos`, remove only media not in the list (or that were deleted via `DELETE /pet/media/{id}`).

**Response:** Pet entity (see schema below)

### Public list (paginated)
`GET /pet/all?page=0&size=10&sortBy=lastSeenDate&sortDirection=desc`

Returns paginated response (see below).

### My pets (user's own pets)
`GET /pet/my-pets`

Returns simple array: `Pet[]`

### Get Pet Thumbnail
`GET /pet/{id}/thumbnail`

Returns image blob (e.g. JPEG). Use for listing (My Pets) and edit primary avatar. `id` = pet id.

### Get Pet Photo
`GET /pet/{id}/photo`

Returns image blob (JPEG). `id` = pet id.

### Delete Pet Media
`DELETE /pet/media/{mediaId}`

Deletes one photo from the pet's gallery. `mediaId` = id from `pet.media[].id`.

---

## Pet entity schema

| Field | Type | Notes |
|-------|------|--------|
| `id` | number | |
| `petName` | string | |
| `breed` | string | |
| `age` | string | e.g. "Young (1-3 years)", "Adult (3-7 years)" |
| `gender` | string | |
| `size` | string | Small, Medium, Large |
| `primaryColor` | string | |
| `distinctiveFeatures` | string | |
| `reportType` | string | e.g. `"LOST"` |
| `lastSeenLocation` | string | |
| `lastSeenDate` | string | Date `YYYY-MM-DD` |
| `lastSeenTime` | string | Time |
| `circumstances` | string | |
| `ownerName` | string | |
| `ownerPhone` | string | |
| `ownerEmail` | string | |
| `emergencyContact` | string | |
| `microchipId` | string | |
| `medicalConditions` | string | |
| `specialInstructions` | string | |
| `photoUrl` | string | e.g. `/pet/{id}/photo` |
| `thumbnailUrl` | string | e.g. `/pet/{id}/thumbnail` |
| `photoPath` | string \| null | Full URL when stored |
| `thumbnailPath` | string \| null | Full URL when stored |
| `media` | array | `{ id, url, mediaType }[]` |
| `privacyEnabled` | boolean | |
| `tempOwnerName` | string \| null | (e.g. for found pets) |
| `tempOwnerPhone` | string \| null | (e.g. for found pets) |

---

## Response shapes

### `/pet/all` (paginated)

```json
{
  "content": [ /* Pet[] */ ],
  "number": 0,
  "size": 10,
  "totalElements": 18,
  "totalPages": 2,
  "first": true,
  "last": false
}
```

### `/pet/my-pets` (array)

```json
[
  { /* Pet */ },
  { /* Pet */ }
]
```

---

## Notes for frontend

- **No `petType` or `veterinarian`** in this schema. If the backend doesn’t expose them, they can be omitted from payloads or sent as optional; backend may ignore unknown fields.
- **Age** values in responses match the report form: `"Puppy (0-1 year)"`, `"Young (1-3 years)"`, `"Adult (3-7 years)"`, `"Senior (7+ years)"`.
- **Multiple photos:** Send multiple `photo` fields in FormData (e.g., `formData.append("photo", file1)`, `formData.append("photo", file2)`). Backend supports up to 5 photos total.
- Use `NEXT_PUBLIC_API_BASE` (or equivalent) for the base URL so the same schema works across environments.
