import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient';
import { Appointment } from '../appointment';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  id: string;
  patientColdRef: AngularFirestoreCollection<Patient>;
  appColRef: AngularFirestoreCollection<Appointment>;
  appointment: Appointment;
  patient: Patient;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private location: Location) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params.id;
    })

    // Display all details of the particular patient
    this.patientColdRef = this.afs.collection('patients');
    this.patientColdRef.ref.where('id', '==', this.id).get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log('doc.id: ' + doc.id, '=>', doc.data());

        this.patient = {
          id : doc.get('id'),
          name: doc.get('name'),
          ic: doc.get('ic'),
          age: doc.get('age'),
          sex: doc.get('sex'),
          hospital_id : doc.get('hospital_id'),
          diagnosis_history : doc.get('diagnosis_history')
        };

        this.patient.diagnosis_history = {
          acuteness : this.patient.diagnosis_history['diagnose_condition']['acuteness'],
          categories : this.patient.diagnosis_history['diagnose_condition']['categories'],
          common_name : this.patient.diagnosis_history['diagnose_condition']['common_name'],
          hint : this.patient.diagnosis_history['diagnose_condition']['extras']['hint'],
          prevalence : this.patient.diagnosis_history['diagnose_condition']['prevalence'],
          severity : this.patient.diagnosis_history['diagnose_condition']['severity'],
          triage_level : this.patient.diagnosis_history['diagnose_condition']['triage_level'],
          initial_symptoms : this.patient.diagnosis_history['initial_symptoms']['name'],
          possible_condition : this.patient.diagnosis_history['possible_conditions']['common_name'],
          condition_probability : this.patient.diagnosis_history['possible_conditions']['probability'],
          questions : this.patient.diagnosis_history['questions']
        }

      });
    }).catch(error => {
      console.log(error);
    }) 
    
    this.appColRef = this.afs.collection('appointments');
    this.appColRef.ref.where('patient_id', '==', this.id).get().then(snapshot => {
      snapshot.forEach(doc => {
        this.appointment = {
          id : doc.get('id'),
          description : doc.get('description'),
          patient_id : doc.get('patient_id'),
          patient_name : doc.get('patient_name'),
          doctor_id : doc.get('doctor_id'),
          doctor_ic: doc.get('doctor_ic'),
          doctor_name : doc.get('doctor_name'),
          hospital_id : doc.get('hospital_id'),
          hospital_name: doc.get('hospital_name'),
          date : doc.get('date'),
          time : doc.get('time'),
          diagnosis_price : doc.get('diagnosis_price'),
        }
      })
    })
  }

  goBack() {
    this.location.back();
  }

}
