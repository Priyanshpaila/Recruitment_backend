import { z } from 'zod';

export const bloodGroups = [
  'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'UNKNOWN'
];

export const upsertIdCardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  bloodGroup: z.enum(bloodGroups),
  residenceAddress: z.string().min(1, 'Residence address is required').max(500),
  emergencyContactNo: z.string()
    .regex(/^[0-9]{7,15}$/, 'Emergency contact number must be 7–15 digits'),
  // Optional: if you already uploaded via separate endpoints and want to set now
  signatureFileId: z.string().optional(),
  photoFileId: z.string().optional()
});
