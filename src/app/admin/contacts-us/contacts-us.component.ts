import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-contacts-us',
  templateUrl: './contacts-us.component.html',
  styleUrls: ['./contacts-us.component.scss']
})
export class ContactsUsComponent implements OnInit {

  public API_IMG_URL = this.commonService.API_IMAGE_URL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  submitted: boolean = false;
  domInt: any = [{"id": 1, "name":"Active"},{"id": 2, "name":"Inactive"}];
  displayedColumns: string[] = ['id', 'Name', 'persons', 'Email', 'Phone', 'Email', 'Addressed', 'SubCatName', 'Title'];
  dataSource: any = new MatTableDataSource([]);

  // frmDOMINT: FormGroup = new FormGroup({
  //   domIntr: new FormControl('')
  // });

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService
    ) {}

  ngOnInit(): void {
    // this.getDomInt();

    setTimeout(()=>{
      this.getContactList();
    }, 1000);
  }

  getDomInt() {
    this.postService.getContact().subscribe((results: any) => {
      this.domInt = results.data;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Filter datasource
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * This function triggers on Save button click
   */
  getContactList() {
    console.log('called');
    this.submitted = true;
    const selectedCategory = 1;
    // this.getPackagesList(selectedCategory);
    this.postService.getContact().subscribe(results => {
      this.dataSource.data = results.data;
    })
    // if (this.frmDOMINT.invalid) {
    //   return;
    // } else {
    // }
  }
}

