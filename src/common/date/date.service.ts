import { Injectable } from '@nestjs/common';
import { User } from '../../feature/user/entities/user.entity';

@Injectable()
export class DateService {
  async getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return new Date(
      Date.UTC(year, month, today, hours, minutes, seconds, milliseconds),
    );
  }

  calculateRefreshToken(): Date {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return new Date(
      Date.UTC(year, month + 1, today, hours, minutes, seconds, milliseconds),
    );
  }
}
