
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-trending-international',
  templateUrl: './trending-international.component.html',
  styleUrls: ['./trending-international.component.scss']
})
export class TrendingInternationalComponent implements OnInit {
  submitted: boolean = false;
  domInt: any = [];
  
  formTrendingPackage: FormGroup = new FormGroup({
    packages: new FormControl('')
  });
  packages: any[] = [];
  responseMsg:boolean = false;
  errResp:boolean = false;

  iMsg:string = '';

  // @ViewChild('formTrendingPackage') form;
  // @ViewChild('formDirective') private formTrendingPackage: NgForm;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private postService: PostService,) { }

  ngOnInit(): void {
    this.formTrendingPackage = this.fb.group({
      package: ['', [Validators.required,]]
    });
    this.getPackagesList();
  }
  get f() {
    return this.formTrendingPackage.controls;
  }
  getPackagesList() {
    // /get-all-itineary
    this.postService.getStatesByDomInt('2').subscribe(result => {
      this.packages = result.data;
      console.log('packages ', this.packages);
      setTimeout(()=>{
        let trendingPackages = this.packages.filter((pack)=>(pack.trending == '1'));
        if(trendingPackages.length){
          this.f['package'].setValue(trendingPackages);
        }
      }, 1000);
    });
  }

  saveDetails() {
    this.submitted = true;
    // const trendingFrm = this.formTrendingPackage;
    const trendingFrmValue = this.formTrendingPackage.value;
    if (this.formTrendingPackage.invalid) {
      return;
    } else {
      let payload:any = {
        categoryId: '2',
        package: []
      }
      trendingFrmValue.package.map((element:any) => {
        payload.package.push('' + element.SubCatID)
      });
      this.postService.sendFormData('menu/updateTrendingPackage', payload)
        .subscribe((result: any) => {
          setTimeout(()=>{
            this.responseMsg = false;
            this.errResp = false;
            if (result.status === 200) {
              this.responseMsg = true;
            } else {
              this.errResp = true;
            }
          }, 1000);
        })

    }
  }
}
