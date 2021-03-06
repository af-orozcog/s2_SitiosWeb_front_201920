import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { RequestService } from '../request.service';
import { UnitService } from '../../unit/unit.service';
import { Unit } from '../../unit/unit';
import { DatePipe } from '@angular/common';
import {Request} from '../request'
import { RequestDetail } from '../request-detail';

import {RequesterService} from '../../requester/requester.service';
import { Requester } from '../../requester/requester';
@Component({
    selector: 'app-request-create',
    templateUrl: './request-create.component.html',
    styleUrls: ['./request-create.component.css'],
    providers:[DatePipe]
  })
export class RequestCreateComponent implements OnInit {
    
    units:Unit[];
    
    requestForm:FormGroup;

    request:RequestDetail;

    requests:Request[]=[];
    constructor(private requestService:RequestService, private unitService:UnitService, private toastr:ToastrService, private formBuilder:FormBuilder, private requesterService:RequesterService, private dp:DatePipe) {
        this.requestForm  = this.formBuilder.group({
            name:["",[Validators.required, Validators.minLength(2)]],
            purpose:["", Validators.required],
            description:["",Validators.required],
            unit:["", Validators.required],
            budget:["", Validators.required],
            beginDate:["",Validators.required],
            dueDate:["", Validators.required],
            endDate:["",Validators.required],
            webCategorySelect:["", Validators.required],
            requestSelect:["",Validators.required]});
    }


    createRequest(newRequest: RequestDetail) {

      console.log("Entro");
      newRequest.description = this.request.description;
      newRequest.budget = this.request.budget;
      newRequest.name = this.request.name;
      newRequest.purpose = this.request.purpose;
      newRequest.beginDate = this.request.beginDate;
      newRequest.dueDate = this.request.dueDate;
      newRequest.endDate = this.request.endDate;
      newRequest.requestType = this.request.requestType;
      newRequest.status = 'Pending';
      newRequest.webCategory = this.request.webCategory;
      this.requesterService.getRequesterDetail(localStorage.getItem('id')).subscribe(p => {
        console.log("unit name "+ p.unit.name);
        console.log("requester login " + p.login);
        console.log("request descr " + newRequest.description);
        console.log("request budget " + newRequest.budget);
        console.log("request nama " + newRequest.name);

        newRequest.requester = p;
        newRequest.unit = p.unit.name;
        console.log("unit del rquest"+ newRequest.unit);
        this.requestService.createRequest(newRequest).subscribe(p => {
          this.requests.push(p);
          this.showSuccess();
          console.log("entro create");
          console.log("unit name "+ newRequest.requester.unit.name);
          console.log("requester login " + newRequest.requester.login);
          console.log("request descr " + newRequest.description);
          console.log("request budget " + newRequest.budget);
          console.log("request nama " + newRequest.name);
        }, err => {
                    this.toastr.error(err, 'Error')});
      }, err => {
        this.toastr.error(err, 'Error')
      });
      


     
    //  this.providerService.getProvider(newProject.provider.id).subscribe(p => {p.projects.push(newProject)});

   
       
        console.warn("el request fue creado", newRequest);
        this.requestService.createRequest(newRequest).subscribe(p => {
          this.showSuccess();
        }, err => {
                    this.toastr.error(err, 'Error')});
    this.requestForm.reset();
   }

   click(request:RequestDetail):void{
    
    this.createRequest(request);

   }
  showSuccess() {
    this.toastr.success("Request", "Successfully created!", {"progressBar": true,timeOut:3000});
  }


    getUnits():void{
       this.unitService.getUnits().subscribe(u=>this.units = u); 
    }
    ngOnInit(): void {
        this.request = new RequestDetail();
        this.getUnits();
    }

    requestType: string[] = ['Elimination','Creation','Change','Development','Production'];

    webCategory: string[] = ['Descriptive','Application','Event'];

    statues: string[] = ['DEVELOPMENT','PRODUCTION','ACCEPTED','PENDING','DENIED'];


}