import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.scss']
})
export class SampleFormComponent implements OnInit {

  submitted: boolean = false;
  domInt: any[] = [
    {
      id: 1,
      name: 'Dom'
,   },
    {
      id: 2,
      name: 'Int'
    }
  ];
  defaultName: string = '';

  frmCreate: FormGroup = new FormGroup({
    domIntr: new FormControl(''),
    username: new FormControl(''),
    // gender: new FormControl(''), // helps in working using radio buttons
    items: new FormControl(''),
    skills: new FormArray([
    ])
  });

  states: any[] = [
    { id: 1, value: 'state-1', viewValue: 'state 1' },
    { id: 2, value: 'state-2', viewValue: 'state 2' },
    { id: 3, value: 'state-3', viewValue: 'state 3' }
  ];

  abcd: any = [];
  
  constructor(private fb: FormBuilder, private postService: PostService) { }

  ngOnInit(): void {
    this.frmCreate = this.fb.group({
      domIntr: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      // gender: ['', [Validators.required]],
      items: ['', [Validators.required]],
      skills: this.fb.array([], Validators.required)
    });

    this.skills.push(this.newSkill());
    
    // Find previously selected value for DOMINT dropdown and set it back as default option on load
    const defaultName = 'sdsd'
    this.f['username'].setValue(defaultName);

    // Find previously selected value for DOMINT dropdown and set it back as default option on load
    const selectedDomInt = this.domInt.find(c => c.id === 2);
    this.f['domIntr'].setValue(selectedDomInt);

    // Find previously selected value for foods dropdown and set it back as default option on load
    const selectedFood = this.states.find(c => c.id === 2);
    this.f['items'].setValue(selectedFood);
  }

  getPkgsByDomInt(elem: any) {
    const selectedCat = elem.value;
    const selectedCatName = (selectedCat.name).toLowerCase();
    this.abcd = [];
    this.postService.getPackages(elem).subscribe(data => {
      this.abcd = data[selectedCatName]
    })
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.frmCreate.controls;
  }

  get skills() : FormArray {
    return this.frmCreate.get("skills") as FormArray
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
  addSkills() {
    this.skills.push(this.newSkill());
  }

  /**
   * This functions is for removing a skill at specific index
   * @param i referns index of the skill from FormArray
   */
  removeSkill(i:number) {
    this.skills.removeAt(i);
  }

  /**
   * Clear Skills form
   */
  clearnSkills() {
    this.skills.controls = [];
  }

  /**
   * This function triggers on Save button click
   */
  saveDetails() {
    this.submitted = true;
    if (this.frmCreate.invalid) {
      return;
    }
    // console.log('Form submitted..', this.frmCreate.value);
  }

}
