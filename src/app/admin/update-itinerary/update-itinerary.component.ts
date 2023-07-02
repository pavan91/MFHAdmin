import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../services/post.service';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash } from '@coreui/icons';

@Component({
  selector: 'app-update-itinerary',
  templateUrl: './update-itinerary.component.html',
  styleUrls: ['./update-itinerary.component.scss']
})
export class UpdateItineraryComponent implements OnInit {

  submitted: boolean = false;
  domInt: any = [];
  defaultName: string = '';

  frmCreateItinerary: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    itineraryName: new FormControl(''),
    packageId: new FormControl(''),
    itineraryShortDesc: new FormControl(''),
    PriceAdult: new FormControl(),
    PriceChild: new FormControl(),
    active: new FormControl(''),
    Inclusions: new FormControl(),
    Exclusions: new FormControl(),
    thingsToNote: new FormControl(),
    itineraries: new FormArray([
    ])
  });

  packages: any[] = [];
  imgResultAfterResize: DataUrl = '';
  
  imgResultMultiple: UploadResponse[] = [];
  imageFile:any;
  public itineraryParams: any = {};
  public itineraryDetails: any = {};
  deletedItineraries:any = [];
  deletedImages:any = [];

  public API_IMG_URL = this.commonService.API_IMAGE_URL;

  
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
  
  constructor(private fb: FormBuilder,
    private toastr: ToastrService, private postService: PostService,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    public iconSet: IconSetService
    ) { 
      iconSet.icons = { cilTrash };
    }

  ngOnInit(): void {
    this.frmCreateItinerary = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      itineraryName: ['', [Validators.required, Validators.minLength(4)]],
      packageId: ['', [Validators.required]],
      itineraries: this.fb.array([], Validators.required),
      itineraryShortDesc: ['', [Validators.maxLength(150)]],
      PriceAdult: [0, [Validators.required, Validators.minLength(2)]],
      PriceChild: [0, [Validators.required, Validators.minLength(2)]],
      Inclusions: [''],
      Exclusions: [''],
      thingsToNote: [''],
      active: false
    });
    this.getDomInt();
    this.activeRoute.params.subscribe((x) => {
      this.itineraryParams = x;
      this.getItineraryDetails();
    });
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((result: any) => {
      this.domInt = result.data;
    })
  }

  getPkgsByDomInt(elem: any) {
      const selectedCategory = elem.value.id;
      this.getPackagesList(selectedCategory);
  }
  getPackagesList(elem: any) {
    const selectedCat = elem;
    this.packages = [];
    if (selectedCat !== undefined) {
      this.postService.getStatesByDomInt(selectedCat).subscribe(results => {
        this.packages = results.data;
      })
    }
  }

  get f() {
    return this.frmCreateItinerary.controls;
  }

  get itineraries() : FormArray {
    return this.frmCreateItinerary.get("itineraries") as FormArray
  }

  newItinerary(): FormGroup {
    return this.fb.group({
      id: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    })
  }

  
  addItinerary() {
    this.itineraries.push(this.newItinerary());
  }

  
  removeItinerary(data:any, i:number) {
    if(data.id != '' || data.id != undefined){
      this.deletedItineraries.push('' + data.id);
    }
    this.itineraries.removeAt(i);
  }

  
  clearItineraries() {
    this.itineraries.controls = [];
    this.addItinerary();
  }
  deleteItineraryImage(imageId:any, imageIndex:any){
    console.log("img delete", imageId);
    console.log("imageindex:", imageIndex)
    this.deletedImages.push(imageId);
    this.itineraryDetails.image.splice(imageIndex, 1);
    console.log(this.itineraryDetails.image)
  }
  deleteTempItineraryImage(imageIndex:any){
    this.imgResultMultiple.splice(imageIndex, 1);
  }


  
  async updateItinerary() {
    this.submitted = true;
    const itineraryFrm = this.frmCreateItinerary;
    const itineraryFrmValue = this.frmCreateItinerary.value;
    if (itineraryFrm.invalid) {
      return;
    } else {
      let payload:any = {
        itinerary_id:this.itineraryDetails.itineraryId,
        Package: itineraryFrmValue.packageId.SubCatID,
        ItineraryName: itineraryFrmValue.itineraryName,
        ItineraryShortDesc: itineraryFrmValue.itineraryShortDesc,
        PriceAdult: itineraryFrmValue.PriceAdult,
        PriceChild: itineraryFrmValue.PriceChild,
        Itineraries: JSON.stringify(this.f['itineraries'].value),
        deletedImages: this.deletedImages,
        deletedItineraries: this.deletedItineraries,
        active: itineraryFrmValue.active?1:0,
        Inclusions: itineraryFrmValue.Inclusions,
        Exclusions: itineraryFrmValue.Exclusions,
        thingsToNote: itineraryFrmValue.thingsToNote,
        file: []
      };
      this.imgResultMultiple.forEach((img)=> {
        payload.file.push({id: '', itinerary_id:this.itineraryDetails.itineraryId, image: img.image});
      })
      
      await this.postService.sendFormData('menu/update-itinerary', payload)
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

  uploadAndResize() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        this.imageFile = new File([image], 'Itenary' + Date.now() + '.png');
        let img = new Image();
        img.src = image;
        img.addEventListener('load',function(){
          console.log(img.width);
          console.log(img.height);
        });
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
        //     console.warn(
        //       'Size in bytes is now:',
        //       this.imageCompress.byteCount(result)
        //     );
        //   });
      });
  }

  uploadMultipleFiles() {
    return this.imageCompress
      .uploadMultipleFiles()
      .then((multipleOrientedFiles: UploadResponse[]) => {
        console.log(multipleOrientedFiles.length);
        console.log(multipleOrientedFiles);
        this.imgResultMultiple = multipleOrientedFiles;
        console.warn(`${multipleOrientedFiles.length} files selected`);
      });
  }

  

  getItineraryDetails() {
    this.postService.getItinerariesById(this.itineraryParams.ItineraryID)
      .subscribe((res: any) => {
        this.itineraryDetails = res.data;
        this.getPackagesList(this.itineraryDetails.CategoryID);
        this.itineraryDetails.itinerary.forEach((itin: any) => {
          this.itineraries.push(
            this.fb.group({
              id: itin.id,
              title: itin.DayTitle,
              description: itin.DayText
            })
          )
        });
        

        setTimeout(()=>{
          this.abcd();
        }, 1000);
      });
  }

  abcd() {
    const selectedDomInt = this.domInt.find((c: any) => c.id === Number(this.itineraryDetails.CategoryID));
     this.f['domIntr'].setValue(selectedDomInt);
     const selectedPackage = this.packages.find((c: any) => c.SubCatID === Number(this.itineraryDetails.packageId));
     this.f['packageId'].setValue(selectedPackage);

     const itenaryTitle = this.itineraryDetails['Title'];
     this.f['itineraryName'].setValue(itenaryTitle);
     const itenaryDescription = this.itineraryDetails['packageDesc'];
     this.f['itineraryShortDesc'].setValue(itenaryDescription);
     
     this.f['Inclusions'].setValue(this.itineraryDetails['Inclusions']);
     this.f['Exclusions'].setValue(this.itineraryDetails['Exclusions']);
     this.f['thingsToNote'].setValue(this.itineraryDetails['thingsToNote']);

     const itenaryPriceAdult = this.itineraryDetails['PriceAdult'];
     this.f['PriceAdult'].setValue(Number(itenaryPriceAdult));
     const itenaryPriceChild = this.itineraryDetails['PriceChild'];
     this.f['PriceChild'].setValue(Number(itenaryPriceChild));
      
     const isStatusActive = this.itineraryDetails['active'] === 1 ? true : false;
     this.f['active'].setValue(isStatusActive);
  }

}

