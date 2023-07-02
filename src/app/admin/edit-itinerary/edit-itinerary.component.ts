import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
// import { MatDialogRef } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-edit-itinerary',
  templateUrl: './edit-itinerary.component.html',
  styleUrls: ['./edit-itinerary.component.scss']
})
export class EditItineraryComponent implements OnInit {
  submitted: boolean = false;
  frmCreate: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    itineraryName: new FormControl(''),
    // gender: new FormControl(''), // helps in working using radio buttons
    items: new FormControl(''),
    itineraryShortDesc: new FormControl(''),
    priceAdult: new FormControl(),
    priceChild: new FormControl(),
    itineraries: new FormArray([
    ])
  });
  packages: any[] = [];
  domInt: any = [];
  responseMsg:boolean = false;
  toastSts: BooleanInput = false
  imgResultAfterResize: DataUrl = '';
  imageFile:any;
  iMsg:string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditItineraryComponent>,
    private fb: FormBuilder,
    private postService: PostService,
    private imageCompress: NgxImageCompressService
    ) { }

  ngOnInit(): void {
    this.frmCreate = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      itineraryName: ['', [Validators.required, Validators.minLength(4)]],
      // gender: ['', [Validators.required]],
      items: ['', [Validators.required]],
      itineraries: this.fb.array([], Validators.required),
      itineraryShortDesc: ['', [Validators.maxLength(150)]],
      priceAdult: [0, [Validators.required, Validators.minLength(2)]],
      priceChild: [0, [Validators.required, Validators.minLength(2)]],
    });
    this.getDomInt();

    // this.itineraries.push(this.newSkill());
    const itineraryDetails = this.data.itineraries;
    console.log(this.data)
    itineraryDetails.forEach((itin: any) => {
      this.itineraries.push(
        this.fb.group({
          skill: itin.title,
          exp: itin.desc
        })
      )
    });
    this.abcd();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.frmCreate.controls;
  }

  get itineraries() : FormArray {
    return this.frmCreate.get("itineraries") as FormArray
  }

  // Formgroup for new sill form
  newSkill(): FormGroup {
    return this.fb.group({
      skill: new FormControl('', Validators.required),
      exp: new FormControl('', Validators.required)
    })
  }

  /**
   * this function adds new skill form to the form
   */
  addItinerary() {
    this.itineraries.push(this.newSkill());
  }

  /**
   * This functions is for removing a skill at specific index
   * @param i referns index of the skill from FormArray
   */
  removeSkill(i:number) {
    this.itineraries.removeAt(i);
  }

  /**
   * Clear itineraries form
   */
  clearnitineraries() {
    this.itineraries.controls = [];
  }

  updateItinerary() {
    this.submitted = true;
    if (this.frmCreate.invalid) {
      return;
    } else {
      const payload = {
        "itinerary_id": this.data.itinerary_id,
        "itineraries": this.frmCreate.value.itineraries
      };
      this.postService.getAllItineraries(payload, 'menu/update-itinerary-details')
        .subscribe((result: any) => {
          if (result.exception_code === 'OK') {
            this.responseMsg = result.message;
            this.responseMsg = true;
            this.dialogRef.close({result: 'update'});
          } else {
            this.responseMsg = result.error_msg;
            this.responseMsg = true;
          }
        })
    }
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((result: any) => {
      // console.log(result);
      this.domInt = result.data;
    })
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

  saveDetails() {
    this.submitted = true;
    const itineraryFrm = this.frmCreate;
    const itineraryFrmValue = this.frmCreate.value;
    if (this.frmCreate.invalid) {
      return;
    } else {
      const payload = {
        // CategoryID: itineraryFrmValue.domIntr.id,
        Package: itineraryFrmValue.items.SubCatID,
        ItineraryName: itineraryFrmValue.itineraryName,
        ItineraryShortDesc: itineraryFrmValue.itineraryShortDesc,
        PriceAdult: itineraryFrmValue.priceAdult,
        PriceChild: itineraryFrmValue.priceChild,
        Itineraries: this.f['itineraries'].value
      };
      const frmData = new FormData();
      frmData.append('Package', itineraryFrmValue.items.SubCatID);
      frmData.append('ItineraryName', itineraryFrmValue.itineraryName);
      frmData.append('ItineraryShortDesc', itineraryFrmValue.itineraryShortDesc);
      frmData.append('PriceAdult', itineraryFrmValue.priceAdult);
      frmData.append('PriceChild', itineraryFrmValue.priceChild);
      frmData.append('Itineraries', this.f['itineraries'].value);
      // console.log(data);
      const url = `menu/update-package`;
      this.postService.updatePackage(url, frmData)
        .subscribe((result: any) => {
          console.log('Result :: ', result);
          if (result.status === 'OK') {
            this.responseMsg = result.message;
            this.responseMsg = true;
          } else {
            this.responseMsg = result.error_msg;
            this.responseMsg = true;
          }
        })

    }
  }
  uploadFile(){
    console.log("Upload File Called", this.imgResultAfterResize);
    
    const frmData = new FormData();
    frmData.append('file', this.imageFile);
    frmData.append('id', this.data.itinerary_id);
    frmData.append('type', 'Itenary');
    
    this.postService.sendFormData('menu/updateImage', frmData)
    .subscribe((result: any) => {
      if (result.status === 'OK') {
        this.responseMsg = result.message;
        this.responseMsg = true;
      } else {
        this.responseMsg = result.error_msg;
        this.responseMsg = true;
      }
    })
  }

  abcd() {
    console.log('DOM INT List :: ', this.domInt)
    console.log('DOM DATA List :: ', this.data)
    const data = {
      Category: this.data.domIntr,
      SubCategory: this.data.SubCatID
    }
    this.postService.abcd(data).subscribe((results: any) => {
      this.data = results['data'][0];
      console.log('Results :: ', this.data);

      // Find previously selected value for DOMINT dropdown and set it back as default option on load
      const selectedDomInt = this.domInt.find((c: any) => c.id === Number(this.data['domIntr']));
      console.log('Previously selected DOM INT :: ', selectedDomInt)
      this.f['domIntr'].setValue(selectedDomInt);
      this.f['items'].setValue(this.data.SubCatID);
      
      const isStatusActive = this.data['Active'] === 1 ? true : false;
      this.f['active'].setValue(isStatusActive);

      // set previously selected package name
      const previouslySelectedPackage = this.data['SubCatName'];
      this.f['packageName'].setValue(previouslySelectedPackage);
      const itenaryTitle = this.data['Title'];
      this.f['Title'].setValue(itenaryTitle);
      const itenaryDescription = this.data['Description'];
      this.f['Description'].setValue(itenaryDescription);
      
      const selectedCategory = this.data.domIntr;
      this.getPackagesList(selectedCategory);
    })
  }

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
            console.log(img_height > 400 , img_width > 700);
          if (img_height > 400 && img_width > 700) {
            console.log(img_height, img_width);
            this.imgResultAfterResize = image;
            this.imageFile = new File([image], 'Slider' + Date.now() + '.png');
          }else{
            this.iMsg = 'Image should have a minimum widht: 700px and height: 400px';
          }
        };
        console.log(orientation);
        console.warn(
          'Size in bytes is now:',
          this.imageCompress.byteCount(image)
        );

        // this.imageCompress
        //   .compressFile(image, orientation, 50, 50, 700, 400)
        //   .then((result: DataUrl) => {
        //     this.imgResultAfterResize = result;
        //     this.imageFile = new File([this.imgResultAfterResize], 'Itenary' + Date.now() + '.png');
        //     console.log(result);
        //     console.warn(
        //       'Size in bytes is now:',
        //       this.imageCompress.byteCount(result)
        //     );
        //   });
      });
  }

}
