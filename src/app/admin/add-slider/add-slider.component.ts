import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { BooleanInput } from '@angular/cdk/coercion';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

@Component({
  selector: 'app-add-slider',
  templateUrl: './add-slider.component.html',
  styleUrls: ['./add-slider.component.scss']
})
export class AddSliderComponent implements OnInit {
  submitted: boolean = false;
  

  formSliderUpdate: FormGroup = new FormGroup({
    CategoryID: new FormControl(''),
    PackageId: new FormControl(''),
    ItenearyId: new FormControl(''),
    active: new FormControl('')
  });
  itenaires:any[] = [];
  packages: any[] = [];
  categories: any = [];
  responseMsg:boolean = false;
  errResp:boolean = false;

  iMsg:string = '';
  toastSts: BooleanInput = false;
  
  imgResultAfterResize: DataUrl = '';
  imageFile:any;

  constructor(
    private dialogRef: MatDialogRef<AddSliderComponent>,
    private fb: FormBuilder,
    private postService: PostService,
    private imageCompress: NgxImageCompressService
    ) { }

  ngOnInit(): void {
    this.formSliderUpdate = this.fb.group({
      CategoryID: ['', [Validators.required]],
      PackageId: ['', [Validators.required]],
      ItenearyId: [''],
      active: false
    });
    this.getDomInt();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.formSliderUpdate.controls;
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((result: any) => {
      // console.log(result);
      this.categories = result.data;
    })
  }
  getPackagesList(elem: any) {
    const selectedCat = elem;
    this.packages = [];
    this.itenaires = [];
    if(this.formSliderUpdate.get('ItenearyId')?.value){
      this.formSliderUpdate.get('ItenearyId')?.reset();
    }
    if (selectedCat !== undefined) {
      this.postService.getStatesByDomInt(selectedCat).subscribe(results => {
        // console.log('packages ', results);
        this.packages = results.data;
        console.log(this.packages)
      })
    }
  }

  getItinerariesList(elem: any) {
      // const selectedCat = elem;
      console.log('ELEM :: ', elem);
      this.itenaires = [];
      if (elem.category !== undefined && elem.package !== undefined) {
        this.postService.getItinerariesByDomInt(elem).subscribe(results => {
          // console.log('States ', results);
          this.itenaires = results.data;
          console.log(this.itenaires)
        })
      } else {
        // this.f['package'].disable();
      }
  }
  getPackageByCategory() {
    if (this.formSliderUpdate.value.CategoryID == undefined) {
      return;
    } else {
      const selectedCategory = this.formSliderUpdate.value.CategoryID.id;
      this.getPackagesList(selectedCategory);
    }
  }
  getItenaryByPackage() {
    console.log(this.formSliderUpdate.value);
    const itenaryFrom = {
      'category': this.formSliderUpdate.value.CategoryID.id,
      'package': this.formSliderUpdate.value.PackageId.SubCatID
    };
    if (this.formSliderUpdate.invalid) {
      return;
    } else {
      this.getItinerariesList(itenaryFrom);
    }
  }
  async uploadFile(){
    const itineraryFrmValue = this.formSliderUpdate.value;
    const frmData = new FormData();
    frmData.append('file', this.imageFile);
    frmData.append('PackageId', itineraryFrmValue.PackageId.SubCatID);
    frmData.append('ItenearyId', itineraryFrmValue.ItenearyId?itineraryFrmValue.ItenearyId.itinerary_id:'');
    
    await this.postService.sendFormData('menu/add-slider', frmData)
    .subscribe((result: any) => {
      setTimeout(()=>{
        if (result.status === 200) {
          this.responseMsg = true;
        } else {
          this.errResp = true;
        }
      }, 1000);
    })
  }

  // uploadMultipleFiles() {
  //   return this.imageCompress
  //     .uploadMultipleFiles()
  //     .then((multipleOrientedFiles: UploadResponse[]) => {
  //       this.imgResultMultiple = multipleOrientedFiles;
  //       console.warn(`${multipleOrientedFiles.length} files selected`);
  //     });
  // }

  uploadAndResize() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        this.iMsg = '';
        let img = new Image();
        img.src = image;
        // @ts-ignore
        img.onload = (rs:any) => {
          let imgRatio = img.width/img.height;
          // get the image height read
          const img_height = rs.currentTarget['height'];
          // get the image width read
          const img_width = rs.currentTarget['width'];
          // check if the dimensions meet the required height and width
            console.log(img_height, img_width, imgRatio);
            console.log(img_height > 600 , img_width > 1900);
          if (img_height > 600 && img_width > 1900) {
            console.log(img_height, img_width);
            this.imgResultAfterResize = image;
            this.imageFile = new File([image], 'Slider' + Date.now() + '.png');
          }else{
            this.iMsg = 'Image should have a minimum widht: 1900px and height: 600px';
          }
        };
        console.log(orientation);
        console.warn(
          'Size in bytes is now:',
          this.imageCompress.byteCount(image)
        );
      });
  }
}

