// src/session/dto/SessionSaveDto.ts
export class SessionSaveDto {
  location: string;
  date: Date;
  courseId: number;

  constructor(data: any) {
    this.location = data.location;
    this.date = new Date(data.date);
    this.courseId = data.courseId;

    if (isNaN(this.courseId)) {
      throw new Error('Invalid courseId');
    }
  }
}
