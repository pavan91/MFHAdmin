import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  submitted: boolean = false;
  domInt: any = [];
  displayedColumns: string[] = ['id', 'name', 'packageImage', 'select'];
  dataSource: any = new MatTableDataSource([]);

  frmDOMINT: FormGroup = new FormGroup({
    domIntr: new FormControl('')
  });
  responseMsg:boolean = false;
  errResp:boolean = false;
  errMsg: String = '';

  constructor(private fb: FormBuilder, private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    /**
     * this method is to invoke DOMINT method on init
     */
    this.getDomInt();
    this.frmDOMINT = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
    });
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

  getPackagesList(elem: any) {
      const selectedCat = elem;
      this.dataSource.data = [];
      if (selectedCat !== undefined) {
        this.postService.getStatesByDomInt(selectedCat).subscribe(results => {
          // console.log('States ', results);
          this.dataSource.data = results.data;
        })
      } else {
        // this.f['package'].disable();
      }
  }

  editPackage(elem: any, evnt: any) {
    // console.log(evnt)
    // console.log(elem);
    // this.router.navigate(['/admin/edit-package']);
    this.router.navigateByUrl(`/admin/edit-package/${evnt.CategoryID}/${evnt.SubCatID}`);
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
  getPackageDetailsByDOMINT() {
    this.submitted = true;
    if (this.frmDOMINT.invalid) {
      return;
    } else {
      const selectedCategory = this.frmDOMINT.value.domIntr.id;
      this.getPackagesList(selectedCategory);
    }
  }
  async deletePackage(packageId: any){
    let payload:any = {
      id: packageId
    };
    await this.postService.sendFormData('menu/deletePackage', payload)
    .subscribe((result: any) => {
      setTimeout(()=>{
        console.log(result.status);
        this.responseMsg = false;
        this.errResp = false;
        if (result.status === 200) {
          this.responseMsg = true;
          const selectedCategory = this.frmDOMINT.value.domIntr.id;
          this.getPackagesList(selectedCategory);
        } else if(result.status === 412) {
          this.errMsg = 'Failed to deleted packages since itinerary already exists';
          this.errResp = true;
        } else {
          this.errMsg = 'Package deletion failed';
          this.errResp = true;
        }
      }, 2000);
    })
  }

}
