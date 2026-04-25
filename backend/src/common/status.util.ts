export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  LATE = 'LATE',
  MISSING = 'MISSING',
  NOT_SUBMITTED = 'NOT_SUBMITTED',
}

export function computeStatus(
  dueDate: Date | null | undefined,
  submissionDate: Date | null | undefined,
): SubmissionStatus {
  const now = new Date();

  if (submissionDate) {
    if (dueDate && submissionDate > dueDate) {
      return SubmissionStatus.LATE;
    }
    return SubmissionStatus.SUBMITTED;
  } else {
    if (dueDate && now > dueDate) {
      return SubmissionStatus.MISSING;
    }
    return SubmissionStatus.NOT_SUBMITTED;
  }
}
