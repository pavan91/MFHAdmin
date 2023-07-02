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
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash } from '@coreui/icons';

@Component({
  selector: 'app-create-itinerary',
  templateUrl: './create-itinerary.component.html',
  styleUrls: ['./create-itinerary.component.scss']
})
export class CreateItineraryComponent implements OnInit {


  submitted: boolean = false;
  domInt: any = [];
  defaultName: string = '';

  frmCreateItinerary: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    itineraryName: new FormControl(''),
    // gender: new FormControl(''), // helps in working using radio buttons
    items: new FormControl(''),
    itineraryShortDesc: new FormControl(''),
    // file: new FormControl(''),
    // fileSource: new FormControl(''),
    priceAdult: new FormControl(),
    priceChild: new FormControl(),
    Inclusions: new FormControl(),
    Exclusions: new FormControl(),
    thingsToNote: new FormControl(),
    itineraries: new FormArray([
    ])
  });

  packages: any[] = [];

  abcd: any = [];
  imgResultAfterResize: DataUrl = '';
  
  imgResultMultiple: UploadResponse[] = [];
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
  
  constructor(private fb: FormBuilder,
    private toastr: ToastrService, private postService: PostService,
    private imageCompress: NgxImageCompressService,
    public iconSet: IconSetService
    ) { 
      iconSet.icons = { cilTrash };
    }

  ngOnInit(): void {
    this.frmCreateItinerary = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      itineraryName: ['', [Validators.required, Validators.minLength(4)]],
      // gender: ['', [Validators.required]],
      items: ['', [Validators.required]],
      itineraries: this.fb.array([], Validators.required),
      itineraryShortDesc: ['', [Validators.maxLength(150)]],
      // file: ['', [Validators.required]],
      priceAdult: [0, [Validators.required, Validators.minLength(2)]],
      priceChild: [0, [Validators.required, Validators.minLength(2)]],
      Inclusions: [''],
      Exclusions: [''],
      thingsToNote: [''],
      // fileSource: ['']
    });

    this.itineraries.push(this.newItinerary());

    /**
     * this method is to invoke DOMINT method on init
     */
     this.getDomInt();
    
    // // Find previously selected value for DOMINT dropdown and set it back as default option on load
    // const defaultName = 'sdsd'
    // this.f['username'].setValue(defaultName);

    // // Find previously selected value for DOMINT dropdown and set it back as default option on load
    // const selectedDomInt = this.domInt.find(c => c.id === 2);
    // this.f['domIntr'].setValue(selectedDomInt);

    // // Find previously selected value for foods dropdown and set it back as default option on load
    // const selectedFood = this.packages.find(c => c.id === 2);
    // this.f['items'].setValue(selectedFood);
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

  // convenience getter for easy access to form fields
  get f() {
    return this.frmCreateItinerary.controls;
  }

  get itineraries() : FormArray {
    return this.frmCreateItinerary.get("itineraries") as FormArray
  }

  // Formgroup for new sill form
  newItinerary(): FormGroup {
    return this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    })
  }

  /**
   * this function adds new skill form to the form
   */
  addItinerary() {
    this.itineraries.push(this.newItinerary());
  }

  /**
   * This functions is for removing a skill at specific index
   * @param i referns index of the skill from FormArray
   */
  removeItinerary(i:number) {
    this.itineraries.removeAt(i);
  }

  /**
   * Clear itineraries form
   */
  clearItineraries() {
    this.itineraries.controls = [];
    this.addItinerary();
  }

  /**
   * This function triggers on Save button click
   */
  async createItinerary() {
    this.submitted = true;
    const itineraryFrm = this.frmCreateItinerary;
    const itineraryFrmValue = this.frmCreateItinerary.value;
    if (itineraryFrm.invalid) {
      return;
    } else {
      let payload:any = {
        // CategoryID: itineraryFrmValue.domIntr.id,
        Package: itineraryFrmValue.items.SubCatID,
        ItineraryName: itineraryFrmValue.itineraryName,
        ItineraryShortDesc: itineraryFrmValue.itineraryShortDesc,
        PriceAdult: itineraryFrmValue.priceAdult,
        PriceChild: itineraryFrmValue.priceChild,
        Itineraries: JSON.stringify(this.f['itineraries'].value),
        Inclusions: itineraryFrmValue.Inclusions,
        Exclusions: itineraryFrmValue.Exclusions,
        thingsToNote: itineraryFrmValue.thingsToNote,
        file: []
      };
      this.imgResultMultiple.forEach((img)=> {
        payload.file.push(img.image);
      })
      // const frmData = new FormData();
      // frmData.append('file', this.imgResultMultiple);
      // frmData.append('Package', itineraryFrmValue.items.SubCatID);
      // frmData.append('ItineraryName', itineraryFrmValue.itineraryName);
      // frmData.append('ItineraryShortDesc', itineraryFrmValue.itineraryShortDesc);
      // frmData.append('PriceAdult', itineraryFrmValue.priceAdult);
      // frmData.append('PriceChild', itineraryFrmValue.priceChild);
      // frmData.append('Itineraries', JSON.stringify(payload.Itineraries));
      
      await this.postService.sendFormData('menu/add-itenary-image', payload)
        .subscribe((result: any) => {
          setTimeout(()=>{
            this.responseMsg = false;
            this.errResp = false;
            if (result.status === 200) {
              this.responseMsg = true;
              this.resetForm();
              this.imgResultMultiple = [];
            } else {
              this.errResp = true;
            }
          }, 1000);
        })
    }
  }

  /**
   * This method is for retrieving all the itineraries
   */
  addItineraryDetails() {
    const payload: any = [];
    this.postService.getAllItineraries(payload, 'menu/itineraries')
        .subscribe((result: any) => {
          if (result.status === 'OK') {
            this.toastr.success(result.message);
            this.resetForm();
          } else {
            this.toastr.error(result.error_msg)
          }
        })
  }

  resetForm() {
    this.submitted = false;
    this.frmCreateItinerary.markAsPristine();
    this.frmCreateItinerary.markAsUntouched();
    this.frmCreateItinerary.reset();
    this.clearItineraries();
  }

  onFileChange(event: any) {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.frmCreateItinerary.patchValue({
        fileSource: file
      });
    }
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
  deleteTempItineraryImage(imageIndex:any){
    this.imgResultMultiple.splice(imageIndex, 1);
  }

}
