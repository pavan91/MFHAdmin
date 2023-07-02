import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-trending-itieanary',
  templateUrl: './trending-itieanary.component.html',
  styleUrls: ['./trending-itieanary.component.scss']
})
export class TrendingItieanaryComponent implements OnInit {
  submitted: boolean = false;
  domInt: any = [];
  
  formTrendingPackage: FormGroup = new FormGroup({
    itinerary: new FormControl('')
  });
  packages: any[] = [];
  categories: any = [];
  responseMsg:boolean = false;
  itenaires:any[] = [];
  // @ViewChild('formTrendingPackage') form;
  // @ViewChild('formDirective') private formTrendingPackage: NgForm;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private postService: PostService,) { }

  ngOnInit(): void {
    this.formTrendingPackage = this.fb.group({
      itinerary: ['', [Validators.required,]]
    });
    this.getItinerariesList();
  }
  get f() {
    return this.formTrendingPackage.controls;
  }

  saveDetails() {
    this.submitted = true;
    // const trendingFrm = this.formTrendingPackage;
    const trendingFrmValue = this.formTrendingPackage.value;
    if (this.formTrendingPackage.invalid) {
      return;
    } else {
      let payload:any = {
        itinerary: []
      }
      trendingFrmValue.itinerary.map((element:any) => {
        payload.itinerary.push('' + element.itinerary_id)
      });
      this.postService.sendFormData('menu/updateTrendingItinerary', payload)
        .subscribe((result: any) => {
          if (result.status === 'OK') {
            this.toastr.success(result.message);
            this.responseMsg = true;
          } else {
            this.toastr.error(result.error_msg)
            this.responseMsg = true;
          }
        })

    }
  }

  getItinerariesList() {
      this.itenaires = [];
        this.postService.getData('menu/get-all-itineary')
        .subscribe((result: any) => {
          this.itenaires = result.data;
          console.log('packages ', this.itenaires);
          setTimeout(()=>{
            let trendingItieanary = this.itenaires.filter((itinerary)=>(itinerary.trending == '1'));
            if(trendingItieanary.length){
              this.f['itinerary'].setValue(trendingItieanary);
            }
          }, 1000);
        })
  }

}
