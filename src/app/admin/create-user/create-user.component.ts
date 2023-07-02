import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  responseMsg:boolean = false;
  errResp:boolean = false;

  iMsg:string = '';

  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.responseMsg = true;
      // if (result.status === 200) {
      // } else {
      //   this.responseMsg = result.error_msg;
      //   this.errResp = true;
      // }
    }, 1000);
  }

}
