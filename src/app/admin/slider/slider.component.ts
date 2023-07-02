import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { EditSliderComponent } from '../edit-slider/edit-slider.component';
import { MatDialog } from '@angular/material/dialog';
import { AddSliderComponent } from '../add-slider/add-slider.component';
import { CommonService } from '../../../services/common.service';
 
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {

  public API_IMG_URL = this.commonService.API_IMAGE_URL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  submitted: boolean = false;
  domInt: any = [{"id": 1, "name":"Active"},{"id": 2, "name":"Inactive"}];
  displayedColumns: string[] = ['id', 'packageImage', 'packageName', 'name', 'select'];
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
      this.getSliderList();
    }, 1000);
  }

  getDomInt() {
    this.postService.getSlider().subscribe((results: any) => {
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
  getSliderList() {
    console.log('called');
    this.submitted = true;
    const selectedCategory = 1;
    // this.getPackagesList(selectedCategory);
    this.postService.getSlider().subscribe(results => {
      this.dataSource.data = results.data;
    })
    // if (this.frmDOMINT.invalid) {
    //   return;
    // } else {
    // }
  }

  editSlider(abcd: any, evnt: any) {
    abcd.stopPropagation();
    console.log(evnt);
    // this.router.navigateByUrl(`/admin/edit-itinerary/${evnt.itinerary_id}`);
    const dialogRef = this.dialog.open(EditSliderComponent, {
      width: '700px',
      data: evnt
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.result === 'update') {
        this.getSliderList();
      }
    })
  }

  addSlider(abcd: any) {
    abcd.stopPropagation();
    // this.router.navigateByUrl(`/admin/edit-itinerary/${evnt.itinerary_id}`);
    const dialogRef = this.dialog.open(AddSliderComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.result === 'update') {
        this.getSliderList();
      }
    })
  }
}
