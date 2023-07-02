import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../services/post.service';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

  submitted: boolean = false;
  isPackageActive = true;
  domInt: any = [];
  dtls: any = {
    categoryId: null,
    packageId: null
  }
  packageDetails: any = {};

  frmEditPkg: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    packageName: new FormControl(''),
    active: new FormControl('')
  });
  imgResultAfterResize: DataUrl = '';
  imageFile:any;
  responseMsg:boolean = false;
  errResp:boolean = false;

  iMsg:string = '';

  tinyMceConfig: any = {
    height: 250,
    // theme: "modern",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
    toolbar:
      'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
    image_advtab: true,
    imagetools_toolbar:
      'rotateleft rotateright | flipv fliph | editimage imageoptions',
    templates: [
      { title: 'Test template 1', content: 'Test 1' },
      { title: 'Test template 2', content: 'Test 2' },
    ],
    content_css: [
      '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      '//www.tinymce.com/css/codepen.min.css',
    ],
  };

  constructor(
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private postService: PostService,
    private route: ActivatedRoute,
    private imageCompress: NgxImageCompressService
    ) { }

  ngOnInit(): void {
    // console.log(this.route.snapshot);
    this.dtls.categoryId = this.route.snapshot.paramMap.get('CategoryID');
    this.dtls.packageId = this.route.snapshot.paramMap.get('SubCatID');
    this.frmEditPkg = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      packageName: ['', [Validators.required, Validators.minLength(4)]],
      active: false
    });
    /**
     * this method is to invoke DOMINT method on init
     */
    this.getDomInt();
    // this.getPackageDetails();

    /**
     * this method invokes to get package details by Cateogry and Sub Category
     * Details will be fetched by URL
     */
    // this.abcd();
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((results: any) => {
      this.domInt = results.data;
      this.abcd();
    })
  }

  // getPackageDetails() {
  //   this.postService.getPackageDetailsById(this.dtls).subscribe(data => {
  //     // console.log('Package Details :: ', data);
  //     this.packageDetails = data;
  //     // console.log('Package Details API :: ', this.packageDetails);
      
  //     // Find previously selected value for DOMINT dropdown and set it back as default option on load
  //     const selectedDomInt = this.domInt.find((c: any) => c.id === this.dtls.categoryId);
  //     this.f['domIntr'].setValue(selectedDomInt);
      
  //     this.f['frmEditPkg'].setValue(selectedDomInt);

  //     // set previously selected package name
  //     const previouslySelectedPackage = this.packageDetails['pkgName'];
  //     this.f['packageName'].setValue(previouslySelectedPackage);
  //   })
  // }

  abcd() {
    console.log('DOM INT List :: ', this.domInt)
    const data = {
      Category: this.dtls.categoryId,
      SubCategory: this.dtls.packageId
    }
    this.postService.abcd(data).subscribe((results: any) => {
      this.packageDetails = results['data'][0];
      console.log('Results :: ', this.packageDetails);

      // Find previously selected value for DOMINT dropdown and set it back as default option on load
      const selectedDomInt = this.domInt.find((c: any) => c.id === Number(this.packageDetails['CategoryID']));
      console.log('Previously selected DOM INT :: ', selectedDomInt)
      this.f['domIntr'].setValue(selectedDomInt);
      
      const isStatusActive = this.packageDetails['Active'] === 1 ? true : false;
      this.f['active'].setValue(isStatusActive);

      // set previously selected package name
      const previouslySelectedPackage = this.packageDetails['SubCatName'];
      this.f['packageName'].setValue(previouslySelectedPackage);
    })
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.frmEditPkg.controls;
  }

  /**
   * This function triggers on Save button click
   */
  saveDetails() {
    this.submitted = true;
    const frmData = this.frmEditPkg.value;
    // console.log('Form Data :: ', frmData)
    if (this.frmEditPkg.invalid) {
      return;
    } else {
      let data:any = {
        "CategoryID": Number(frmData.domIntr.id),
        "SubCatID": Number(this.dtls.packageId),
        "SubCatName": frmData.packageName,
        "Active": frmData.active ? 1 : 0
      }
      
      if(this.imgResultAfterResize){
        data['file'] = this.imgResultAfterResize;
      }
      // console.log(data);
      const url = `menu/update-package`;
      this.postService.updatePackage(url, data, )
        .subscribe((result: any) => {
          console.log('Result :: ', result);
          setTimeout(()=>{
            this.responseMsg = false;
            this.errResp = false;
            if (result.status === 200) {
              this.responseMsg = true;
            } else {
              this.errResp = true;
            }
          }, 1000);
          // if (result.status === 'OK') {
          //   this.toastr.success(result.message);
          // } else {
          //   this.toastr.error(result.error_msg)
          // }
        })

    }
  }
  async uploadFile(){
    console.log("Upload File Called", this.imageFile);
    
    const frmData = new FormData();
    if(this.imgResultAfterResize){
      frmData.append('file', this.imgResultAfterResize); 
    }
    frmData.append('id', this.dtls.packageId);
    frmData.append('type', 'Package');
    
    await this.postService.sendFormData('menu/updateImage', frmData)
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
            console.log(img_height > 780 , img_width > 1900);
          if (img_height > 780 && img_width > 1900) {
            console.log(img_height, img_width);
            this.imgResultAfterResize = image;
          }else{
            this.iMsg = 'Image should have a minimum widht: 1900px and height: 780px';
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
