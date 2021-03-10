import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { DatePipe } from '@angular/common';

export interface event {
  title: string,
  date: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'calendar';
  showForm: boolean = false;
  showEditForm: boolean = false;
  date: string;
  task: event;
  events: event[] = [];
  editedTask: event;
  editedIndex: number;
  editedTitle: string;
  form = new FormGroup({
    title: new FormControl("", Validators.required)
  });

  editForm = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)

  });

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: []
  };

  constructor(public datepipe: DatePipe) {

  }
  ngOnInit(): void {
    this.update();
  }

  public update() {
    let initialValue = localStorage.getItem('events');
    if (initialValue == null) {
      this.events = [];
      this.calendarOptions.events = [];
    }
    else {
      this.events = JSON.parse(localStorage.getItem('events'));
      this.calendarOptions.events = JSON.parse(localStorage.getItem('events'));
    }

  }

  public handleDateClick(arg) {
    this.showForm = true;
    this.date = arg.dateStr;
  }

  public handleEventClick(e) {
    this.openEditForm(e);
    this.showEditForm = true;
  }

  public addTask(val, date): void {
    this.task = {
      title: val.title, date: date
    }
    this.events.push(this.task);
    localStorage.setItem('events', JSON.stringify(this.events));
    this.calendarOptions.events = JSON.parse(localStorage.getItem('events'));
    this.form.reset();
    this.showForm = false;
  }

  public editTask(val): void {
    this.events[this.editedIndex] = val;
    localStorage.setItem('events', JSON.stringify(this.events));
    this.calendarOptions.events = JSON.parse(localStorage.getItem('events'));
    this.showEditForm = false;

  }

  public deleteTask(val): void {
    for (let i of this.events) {
      if (i.title == val.title) {
        this.events.splice(this.events.indexOf(i), 1);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.calendarOptions.events = JSON.parse(localStorage.getItem('events'));
        this.showEditForm = false;
      }
    }
  }

  public openEditForm(val): void {
    this.editForm = new FormGroup({
      title: new FormControl(val.event.title, Validators.required),
      date: new FormControl(this.datepipe.transform(val.event.start, 'yyyy-MM-dd'), Validators.required)
    });
    this.showEditForm = true;
    this.date = this.datepipe.transform(val.event.start, 'yyyy-MM-dd');
    this.editedTask = this.editForm.value;
    this.editedIndex = this.events.findIndex((elem) => { return elem.title === this.editedTask.title });

  }
}

