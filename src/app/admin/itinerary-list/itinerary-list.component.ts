import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../../services/post.service';
import { EditItineraryComponent } from '../edit-itinerary/edit-itinerary.component';


@Component({
  selector: 'app-itinerary-list',
  templateUrl: './itinerary-list.component.html',
  styleUrls: ['./itinerary-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItineraryListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  submitted: boolean = false;
  domInt: any = [];
  packages: any[] = [];
  displayedColumns: string[] = ['name', 'priceAdult', 'priceChild', 'days', 'select'];
  expandedElement = null;
  dataSource: any = new MatTableDataSource([]);

  frmDOMINT: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    items: new FormControl(''),
  });
  responseMsg:boolean = false;
  errResp:boolean = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    /**
     * this method is to invoke DOMINT method on init
     */
    this.getDomInt();
    this.frmDOMINT = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      items: ['', [Validators.required]]
    });
  }

  getPkgsByDomInt(elem: any) {
    // this.submitted = true;
      const selectedCategory = elem.value.id;
      this.getPackagesList(selectedCategory);
  }

  getPackagesList(elem: any) {
    const selectedCat = elem;
    this.packages = [];
    if (selectedCat !== undefined) {
      this.postService.getStatesByDomInt(selectedCat).subscribe(results => {
        // console.log('packages ', results);
        this.packages = results.data;
      })
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.frmDOMINT.controls;
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((results: any) => {
      this.domInt = results.data;
    })
  }

  getItinerariesList(elem: any) {
    console.log('method getItinerariesList :: ', elem);
      // const selectedCat = elem;
      console.log('ELEM :: ', elem);
      this.dataSource.data = [];
      if (elem.category !== undefined && elem.package !== undefined) {
        this.postService.getItinerariesByDomInt(elem).subscribe(results => {
          // console.log('States ', results);
          this.dataSource.data = results.data;
        })
      } else {
        // this.f['package'].disable();
      }
  }

  editPackage(abcd: any, evnt: any) {
    abcd.stopPropagation();
    console.log(evnt);
    // this.router.navigateByUrl(`/admin/edit-itinerary/${evnt.itinerary_id}`);
    const dialogRef = this.dialog.open(EditItineraryComponent, {
      width: '700px',
      data: evnt
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.result === 'update') {
        this.getItinerariesByDOMINT();
      }
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
  getItinerariesByDOMINT() {
    this.submitted = true;
    if (this.frmDOMINT.invalid) {
      return;
    } else {
      console.log(this.frmDOMINT.value)
      const selectedCategory = this.frmDOMINT.value.domIntr.id;
      const data = {
        category: this.frmDOMINT.value.domIntr.id,
        package: this.frmDOMINT.value.items.SubCatID
      }
      this.getItinerariesList(data);
    }
  }

  
  navigateToUpdate(element: any){
    let url =  'admin/update-itinerary/' + element.itinerary_id;
    console.log(element, url)
    this.router.navigate([url]);
  }
  async deleteItineraries(element: any){
    let payload:any = {
      id: element.itinerary_id
    };
    await this.postService.sendFormData('menu/deleteItinerary', payload)
    .subscribe((result: any) => {
      setTimeout(()=>{
        console.log(result.status);
        this.responseMsg = false;
        this.errResp = false;
        if (result.status === 200) {
          this.responseMsg = true;
          const selectedCategory = this.frmDOMINT.value.domIntr.id;
          const data = {
            category: this.frmDOMINT.value.domIntr.id,
            package: this.frmDOMINT.value.items.SubCatID
          }
          this.getItinerariesList(data);
        } else {
          this.errResp = true;
        }
      }, 2000);
    })
  }

}
