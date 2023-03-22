import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail-history',
  templateUrl: './mail-history.component.html',
  styleUrls: ['./mail-history.component.sass']
})
export class MailHistoryComponent implements OnInit {

  @Input() EmailHistory:[];
  constructor() { }

  ngOnInit(): void {
  }
}
