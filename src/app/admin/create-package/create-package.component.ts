import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../services/post.service';

// import { UploadService } from  '../../../services/upload.service';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss']
})
export class CreatePackageComponent implements OnInit {
//   @ViewChild("fileUpload") 
//   set fileUpload(val: ElementRef) {
//   if(val) {
//     console.log(val);
//   }
// }
  // @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];

  // selectedFile: File = null;

  submitted: boolean = false;
  domInt: any = [];
  
  frmCreatePkg: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    packageName: new FormControl(''),
    file: new FormControl(''),
    fileSource: new FormControl('')
  });
  // @ViewChild('frmCreatePkg') form;
  // @ViewChild('formDirective') private frmCreatePkg: NgForm;
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
    private postService: PostService,) { }

  ngOnInit(): void {
    this.frmCreatePkg = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      packageName: ['', [Validators.required, Validators.minLength(4)]],
      file: ['', [Validators.required]],
      fileSource: ['']
    });
    /**
     * this method is to invoke DOMINT method on init
     */
    this.getDomInt();
  }

  getDomInt() {
    this.postService.getDOMInt().subscribe((result: any) => {
      // console.log(result);
      this.domInt = result.data;
    })
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.frmCreatePkg.controls;
  }

  /**
   * This function triggers on Save button click
   * it's not capable of uploading an image
   */
  async saveDetails() {
    this.submitted = true;
    const frmValue = this.frmCreatePkg.value;
    if (this.frmCreatePkg.invalid) {
      console.log(this.frmCreatePkg)
      return;
    } else {
      const data = {
        CategoryID: frmValue.domIntr.id,
        SubCatName: frmValue.packageName,
      }
      await this.postService.createPackageByDOM(data, 'menu/create-package')
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

  /**
   * This function triggers on Save button click
   * it's not capable of uploading an image
   */
  createPackageWithImage() {
    this.submitted = true;
    const frmValue = this.frmCreatePkg.value;
    if (this.frmCreatePkg.invalid) {
      console.log(this.frmCreatePkg)
      return;
    } else {
      const frmData = new FormData();
      frmData.append('file', this.frmCreatePkg.get('fileSource')?.value);
      frmData.append('CategoryID', frmValue.domIntr.id);
      frmData.append('SubCatName', frmValue.packageName);
  
      this.postService.sendFormData('menu/upload-package-image', frmData)
        .subscribe((result: any) => {
          // console.log('Result :: ', result)
          // console.log('Save Details Form Data result :: ', result)
          if (result.status === 200) {
            console.log('Success :: ', result)
            this.toastr.success(result.statusText);
            this.resetForm();
          } else {
            console.log('Error :: ', result)
            this.toastr.error(result.error_msg)
          }
      })
    }    
  }

  onFileChange(event: any) {
    // if (event.target.files.length > 0) {
    //   const file = event.target.files[0];
    //   this.frmCreatePkg.get('packageImage').setValue(file);
    // }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.frmCreatePkg.patchValue({
        fileSource: file
      });
    }
  }

  resetForm() {
    this.submitted = false;
    this.frmCreatePkg.markAsPristine();
    this.frmCreatePkg.markAsUntouched();
    this.frmCreatePkg.reset();
  }

}
