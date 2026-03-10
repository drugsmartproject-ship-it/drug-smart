export function generatePharmacyId(): string {
  const prefix = "PH";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateReceiptNumber(pharmacyId: string): string {
  const prefix = pharmacyId.split("-")[1] ?? "RX";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `${prefix}-${timestamp}`;
}
