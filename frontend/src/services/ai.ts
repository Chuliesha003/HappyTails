// src/services/ai.ts
export async function analyzeSymptoms(params: {
  symptoms?: string;
  petType?: string;
  age?: string | number;
  photoFile?: File;
}) {
  const form = new FormData();
  if (params.symptoms) form.append('symptoms', params.symptoms);
  if (params.petType) form.append('petType', params.petType);
  if (params.age !== undefined) form.append('age', String(params.age));
  if (params.photoFile) form.append('photo', params.photoFile); // field name MUST be 'photo'

  const res = await fetch('http://localhost:5000/api/ai/symptoms', { method: 'POST', body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}