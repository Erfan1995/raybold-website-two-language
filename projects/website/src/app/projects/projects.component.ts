import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService} from './projects.service';
import {DynamicScriptLoaderService} from '../services/DynamicScriptLoaderService';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  serviceId;
  projects = [];
  offSet = 0;
  showButton = false;
  projectList;
  serviceTitle;

  constructor(private activatedRoute: ActivatedRoute,
              private projectService: ProjectsService,
              private dynamicScriptLoader: DynamicScriptLoaderService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParams => {
      this.serviceId = this.activatedRoute.snapshot.params.service_id;
      if (this.serviceId) {
        this.serviceTitle = this.activatedRoute.snapshot.params.title;
        this.projects = [];
        this.offSet = 0;
        this.listProjects();
      } else {
        this.listProjectsWithOffset(this.offSet);
        this.serviceTitle = 'نمونه کارها';
      }
      this.dynamicScriptLoader.loadScript('main');

    });
  }

  listProjects() {
    this.projectService.listProjects(this.serviceId, this.offSet).subscribe(
      (result) => {
        this.projectList = result;
        this.projectList.reverse();
        this.offsetFunc();
      }
    );
  }

  listProjectsWithOffset(blogItemNumber) {
    this.projectService.listProjectWithOffset(blogItemNumber).subscribe(
      result => {
        this.projectList = result;
        this.offsetFunc();
      }
    );
  }

  offsetFunc() {
    for (const project of this.projectList) {
      for (const projectFile of project.project_file) {
        projectFile.file_path = this.projectService.FilePath(projectFile.file_path);
      }
    }
    this.showButton = true;
    for (const project of this.projectList) {
      this.projects.push({
        link: project.link,
        title: project.title,
        project_id: project.project_id,
        project_file: project.project_file
      });
    }
  }

  viewMoreProjects() {
    this.offSet += this.projectList.length;
    if (this.serviceId) {
      this.listProjects();
    } else {
      this.listProjectsWithOffset(this.offSet);
    }

    this.dynamicScriptLoader.loadScript('main');
  }
}

