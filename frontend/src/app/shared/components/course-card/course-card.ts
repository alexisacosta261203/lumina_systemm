import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../interfaces/course.interface';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  @Input({ required: true }) course!: Course;
  @Input() showBuyButton = true;

  @Output() buyRequested = new EventEmitter<number>();

  requestBuy(): void {
    this.buyRequested.emit(this.course.id);
  }
}