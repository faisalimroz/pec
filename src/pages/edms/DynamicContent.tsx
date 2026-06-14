import React, { useState, Suspense, useMemo, useEffect } from "react"
import axios from 'axios';
import {
  Search,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react"

type TreeNode = {
  id: string
  title: string
  type: "folder" | "file"
  count?: number | string
  countKey?: string
  component?: string
  children?: TreeNode[]
}

const componentModules = import.meta.glob("/src/pages/**/*.tsx")

const navJson: TreeNode[] = [


  {
    id: "letters",
    title: "Letters",
    type: "folder",
    countKey: "letter-grand-total",
    children: [
      {
        id: "incoming-letters",
        title: "Incoming Letters",
        type: "folder",
        countKey: "letter-incoming-total",
        children: [
          {
            id: "letter-attachment-incoming-index",
            title: "Administrative",
            type: "file",
            component: "admin- edms/letter-attachment/incoming/index",
            countKey: "admin-letter-incoming",
          },
          {
            id: "road-traffic-letter-attachment-incoming-index",
            title: "Road & Traffic",
            type: "file",
            component: "road-and-traffic-edms/letter-attachment/incoming/index",
            countKey: "road-letter-incoming",
          },
          {
            id: "mb-letter-attachment-incoming",
            title: "Main Bridge",
            type: "file",
            component: "mb-pis-edms/letter-attachment/incoming/index",
            countKey: "mbpmis-letter-incoming",
          },
          {
            id: "rtw-letter-attachment-incoming",
            title: "RTW",
            type: "file",
            component: "rtw-edms/letter-attachment/incoming/index",
            countKey: "rtw-letter-incoming",
          },
          {
            id: "toll-letter-attachment-incoming",
            title: "Toll",
            type: "file",
            component: "toll-edms/letter-attachment/incoming/index",
            countKey: "toll-letter-incoming",
          },
          {
            id: "its-letter-attachment-incoming-index",
            title: "ITS",
            type: "file",
            component: "its-edms/letter-attachment/incoming/index",
            countKey: "its-letter-incoming",
          },
        ],
      },
      {
        id: "outgoing-letters",
        title: "Outgoing Letters",
        type: "folder",
        countKey: "letter-outgoing-total",
        children: [
          {
            id: "letter-attachment-outgoing-index",
            title: "Administrative",
            type: "file",
            component: "admin- edms/letter-attachment/outgoing/index",
            countKey: "admin-letter-outgoing",
          },
          {
            id: "road-traffic-letter-attachment-outgoing-index",
            title: "Road & Traffic",
            type: "file",
            component: "road-and-traffic-edms/letter-attachment/outgoing/index",
            countKey: "road-letter-outgoing",
          },
          {
            id: "mb-letter-attachment-outgoing",
            title: "Main Bridge",
            type: "file",
            component: "mb-pis-edms/letter-attachment/outgoing/index",
            countKey: "mbpmis-letter-outgoing",
          },
          {
            id: "rtw-letter-attachment-outgoing",
            title: "RTW",
            type: "file",
            component: "rtw-edms/letter-attachment/outcoming/index",
            countKey: "rtw-letter-outgoing",
          },
          {
            id: "toll-letter-attachment-outgoing",
            title: "Toll",
            type: "file",
            component: "toll-edms/letter-attachment/outgoing/index",
            countKey: "toll-letter-outgoing",
          },
          {
            id: "its-letter-attachment-outgoing-index",
            title: "ITS",
            type: "file",
            component: "its-edms/letter-attachment/outgoing/index",
            countKey: "its-letter-outgoing",
          },
        ],
      },
    ],
  },
  {
    id: "admin-edms",
    title: "Administration",
    type: "folder",
    countKey: "total",
    children: [
      {
        id: "asset-management",
        title: "Asset Management",
        type: "folder",
        countKey: "asset-management",
        children: [
          {
            id: "asset-management-index",
            title: "Index",
            type: "file",
            component: "admin- edms/asset-management/index",
            countKey: "asset-management",
          },
        ],
      },
      {
        id: "building-maintenance",
        title: "Building Maintenance",
        type: "folder",
        children: [
          {
            id: "building-maintenance-monthly-report-index",
            title: "Monthly Maintainance Report",
            type: "file",
            component: "admin- edms/building-maintenance/monthly-report/index",
            countKey: "building-monthly-maintenance",
          },
          {
            id: "building-maintenance-tools-index",
            title: "Tools",
            type: "file",
            component: "admin- edms/building-maintenance/tools/index",
            countKey: "building-tools",
          },
        ],
      },
      {
        id: "employee-personal-profile",
        title: "Employee Personal Profile",
        type: "folder",
        countKey: "hr-employee-personal",
        children: [
          {
            id: "employee-personal-profile-index",
            title: "Index",
            type: "file",
            component: "admin- edms/employee-personal-profile/index",
            countKey: "hr-employee-personal",
          },
        ],
      },
      {
        id: "fire-mgt",
        title: "Fire Management",
        type: "folder",
        children: [
          {
            id: "fire-mgt-monthly-report-index",
            title: "Monthly Activity",
            type: "file",
            component: "admin- edms/fire-mgt/fire-monthly-report/index",
            countKey: "fire-monthly-activity",
          },
          {
            id: "fire-mgt-tools-index",
            title: "Tools",
            type: "file",
            component: "admin- edms/fire-mgt/fire-tools/index",
            countKey: "fire-tools",
          },
        ],
      },
        {
        id: "finance-management",
        title: "Finance",
        type: "folder",
        children: [
          {
            id: "monthly-ipc",
            title: "Monthly IPC Updates",
            type: "file",
            component: "admin- edms/ipc/ipc-monthly-updates/index",
            countKey: "monthly-ipc",
          },
          {
            id: "ipc-records",
            title: "IPC Records",
            type: "file",
            component: "admin- edms/ipc/ipc-records/index",
            countKey: "ipc-records",
          }
        ],
      },
      {
        id: "gardening",
        title: "Gardening",
        type: "folder",
        children: [
          {
            id: "gardening-monthly-activity-index",
            title: "Monthly Activity",
            type: "file",
            component: "admin- edms/gardening/gardening-monthly-activity/index",
            countKey: "gardening-monthly-activity",
          },
          {
            id: "gardening-tools-index",
            title: "Gardening Tools",
            type: "file",
            component: "admin- edms/gardening/gardening-tools/index",
            countKey: "gardening-tools",
          },
        ],
      },
      {
        id: "health-center",
        title: "Health Center",
        type: "folder",
        children: [
          {
            id: "health-center-medical-equipment",
            title: "Medical Equipment Record",
            type: "file",
            component: "admin- edms/health-center/medical-equipment-record",
            countKey: "health-medicine-equipment",
          },
          {
            id: "health-center-medicine-in-out",
            title: "Medicine In-Out Record",
            type: "file",
            component: "admin- edms/health-center/medicine-in-out-record",
            countKey: "health-medicine-inout",
          },
          {
            id: "health-center-monthly-report",
            title: "Monthly Report",
            type: "file",
            component: "admin- edms/health-center/monthly-report",
            countKey: "health-monthly-report",
          },
        ],
      },
      {
        id: "it-electronics-communication",
        title: "IT Electronics Communication",
        type: "folder",
        children: [
          {
            id: "it-electronics-monthly-report-index",
            title: "Monthly Report",
            type: "file",
            component:
              "admin-edms/it-electronics-communication/it-electronics-monthly-report/index",
            countKey: "it-electronics-monthly-report",
          },
          {
            id: "it-electronics-tools-index",
            title: "Tools",
            type: "file",
            component:
              "admin-edms/it-electronics-communication/it-electronics-tools/index",
            countKey: "it-electronics-tools",
          },
        ],
      },
      {
        id: "organogram",
        title: "Organogram",
        type: "folder",
        countKey: "organogram",
        children: [
          {
            id: "organogram-index",
            title: "Index",
            type: "file",
            component: "admin- edms/organogram/index",
            countKey: "organogram",
          },
        ],
      },
      {
        id: "security-mgt",
        title: "Security Management",
        type: "folder",
        children: [
          {
            id: "security-mgt-monthly-report-index",
            title: "Security Monthly Report",
            type: "file",
            component: "admin- edms/security-mgt/security-monthly-report/index",
            countKey: "security-monthly-report",
          },
          {
            id: "security-mgt-tools-index",
            title: "Security Tools",
            type: "file",
            component: "admin- edms/security-mgt/security-tools/index",
            countKey: "security-tools",
          },
        ],
      },
      {
        id: "vehicle-mgt-record",
        title: "Vehicle Management Record",
        type: "folder",
        countKey: "vehicle-mgt-record",
        children: [
          {
            id: "vehicle-mgt-record-index",
            title: "Index",
            type: "file",
            component: "admin- edms/vehicle-mgt-record/index",
            countKey: "vehicle-mgt-record",
          },
        ],
      },
    ],
  },
  {
    id: "road-and-traffic-edms",
    title: "Road & Traffic",
    type: "folder",
    countKey: "road-total",
    children: [
      {
        id: "road-traffic-orgaorganization-organogram",
        title: "Orgaorganization Organogram",
        type: "folder",
        countKey: "road-organogram",
        children: [
          {
            id: "road-traffic-orgaorganization-organogram-index",
            title: "Index",
            type: "file",
            component: "road-and-traffic-edms/orgaorganization-organogram/index",
            countKey: "road-organogram",
          },
        ],
      },
      {
        id: "road-traffic-monthly-roaster",
        title: "Monthly Roaster",
        type: "folder",
        countKey: "road-monthly-roster",
        children: [
          {
            id: "road-traffic-monthly-roaster-index",
            title: "Index",
            type: "file",
            component: "road-and-traffic-edms/monthly-roaster/index",
            countKey: "road-monthly-roster",
          },
        ],
      },
      {
        id: "road-traffic-monthly-report",
        title: "Monthly Report",
        type: "folder",
        countKey: "road-monthly-report",
        children: [
          {
            id: "road-traffic-monthly-report-index",
            title: "Index",
            type: "file",
            component: "road-and-traffic-edms/monthly-report/index",
            countKey: "road-monthly-report",
          },
        ],
      },

      {
        id: "road-and-maintenance",
        title: "Road And Maintenance",
        type: "folder",
        countKey: "road-maintenance-total",
        children: [
          {
            id: "road-and-maintenance-accident",
            title: "Accident",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/accident/index",
            countKey: "road-maintenance-accident-report",
          },
          {
            id: "road-and-maintenance-completion-form",
            title: "Completion Form",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/completion-form/index",
            countKey: "road-maintenance-completion-form",
          },
          {
            id: "road-and-maintenance-drawing",
            title: "Drawing",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/drawing/index",
            countKey: "road-maintenance-drawings",
          },
          {
            id: "road-and-maintenance-inspection-report",
            title: "Inspection Report",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/inspection-report/index",
            countKey: "road-maintenance-inspection-report",
          },
          {
            id: "road-and-maintenance-letter-attachment",
            title: "Letter Attachment",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/letter-attachment/index",
            countKey: "road-maintenance-letter-attachment",
          },
          {
            id: "road-and-maintenance-miscellaneous",
            title: "Miscellaneous",
            type: "file",
            component: "road-and-traffic-edms/road-and-maintenance/miscellaneous/index",
            countKey: "road-maintenance-miscellaneous",
          },
          {
            id: "road-and-maintenance-reciving-materials-form",
            title: "Reciving Materials Form",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-maintenance/reciving-materials-form/index",
            countKey: "road-maintenance-receiving-materials",
          },
          {
            id: "road-and-maintenance-requisition-form",
            title: "Requisition Form",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-maintenance/requisition-form/index",
            countKey: "road-maintenance-requisition-form",
          },
        ],
      },

      {
        id: "road-and-patrol",
        title: "Road And Patrol",
        type: "folder",
        countKey: "road-safety-total",
        children: [
          {
            id: "road-and-patrol-accident",
            title: "Accident",
            type: "file",
            component: "road-and-traffic-edms/road-and-patrol/accident/index",
            countKey: "road-safety-accident-report",
          },
          {
            id: "road-and-patrol-completion-form",
            title: "Completion Form",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/completion-form/index",
            countKey: "road-safety-completion-form",
          },
          {
            id: "road-and-patrol-controllers-report",
            title: "Controllers Report",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/controllers-report/index",
            countKey: "road-safety-controllers-report",
          },
          {
            id: "road-and-patrol-drawing",
            title: "Drawing",
            type: "file",
            component: "road-and-traffic-edms/road-and-patrol/drawing/index",
            countKey: "road-safety-drawing",
          },
          {
            id: "road-and-patrol-inspection-report",
            title: "Inspection Report",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/inspection-report/index",
            countKey: "road-safety-inspection-report",
          },
          {
            id: "road-and-patrol-letter-attachment",
            title: "Letter Attachment",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/letter-attachment/index",
            countKey: "road-safety-letter-attachment",
          },
          {
            id: "road-and-patrol-miscellaneous",
            title: "Miscellaneous",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/miscellaneous/index",
            countKey: "road-safety-miscellaneous",
          },
          {
            id: "road-and-patrol-reciving-materials-form",
            title: "Reciving Materials Form",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/reciving-materials-form/index",
            countKey: "road-safety-receiving-materials",
          },
          {
            id: "road-and-patrol-requisition-form",
            title: "Requisition Form",
            type: "file",
            component:
              "road-and-traffic-edms/road-and-patrol/requisition-form/index",
            countKey: "road-safety-requisition-form",
          },
        ],
      },

      {
        id: "workshop",
        title: "Workshop",
        type: "folder",
        countKey: "road-workshop-total",
        children: [
          {
            id: "workshop-accident",
            title: "Accident",
            type: "file",
            component: "road-and-traffic-edms/workshop/accident/index",
            countKey: "road-workshop-accident",
          },
          {
            id: "workshop-completion-form",
            title: "Completion Form",
            type: "file",
            component: "road-and-traffic-edms/workshop/completion-form/index",
            countKey: "road-workshop-completion",
          },
          {
            id: "workshop-drawing",
            title: "Drawing",
            type: "file",
            component: "road-and-traffic-edms/workshop/drawing/index",
            countKey: "road-workshop-drawing",
          },
          {
            id: "workshop-inspection-report",
            title: "Inspection Report",
            type: "file",
            component: "road-and-traffic-edms/workshop/inspection-report/index",
            countKey: "road-workshop-inspection",
          },
          {
            id: "workshop-letter-attachment",
            title: "Letter Attachment",
            type: "file",
            component:
              "road-and-traffic-edms/workshop/letter-attachment/index",
            countKey: "road-workshop-letter-attachment",
          },
          {
            id: "workshop-miscellaneous",
            title: "Miscellaneous",
            type: "file",
            component: "road-and-traffic-edms/workshop/miscellaneous/index",
            countKey: "road-workshop-miscellaneous",
          },
          {
            id: "workshop-reciving-materials-form",
            title: "Reciving Materials Form",
            type: "file",
            component:
              "road-and-traffic-edms/workshop/reciving-materials-form/index",
            countKey: "road-workshop-receiving-materials",
          },
          {
            id: "workshop-requisition-form",
            title: "Requisition Form",
            type: "file",
            component:
              "road-and-traffic-edms/workshop/requisition-form/index",
            countKey: "road-workshop-requisition",
          },
        ],
      },
    ],
  },
  {
    id: "mb-pis-edms",
    title: "Main Bridge",
    type: "folder",
    countKey: "mbpmis-total",
    children: [
      {
        id: "mb-communication-correspondence",
        title: "Communication Correspondence",
        type: "folder",
        countKey: "mbpmis-communication-total",
        children: [
          {
            id: "mb-communication-correspondence-index",
            title: "All RTW-related Letters & Official Correspondence",
            type: "file",
            component:
              "mb-pis-edms/communication-correspondence/letter-and-correspondence/index",
            countKey: "mbpmis-communication-letter",
          },
          {
            id: "mb-communication-correspondences",
            title: "Meeting Minutes",
            type: "file",
            component:
              "mb-pis-edms/communication-correspondence/meeting-minutes/index",
            countKey: "mbpmis-communication-meeting-minutes",
          },
        ],
      },
      {
        id: "mb-financial-documentation",
        title: "Financial Documentation",
        type: "folder",
        countKey: "mbpmis-financial-bills",
        children: [
          {
            id: "mb-financial-documentation-index",
            title: "Main Bridge Bills",
            type: "file",
            component:
              "mb-pis-edms/financial-documentation/main-bridge-bills/index",
            countKey: "mbpmis-financial-bills",
          },
        ],
      },
      {
        id: "mb-monitoring-reporting",
        title: "Monitoring Reporting",
        type: "folder",
        countKey: "mbpmis-monitoring-total",
        children: [
          {
            id: "mb-monitoring-reporting-index",
            title: "Index",
            type: "file",
            component: "mb-pis-edms/monitoring-reporting/index",
            countKey: "mbpmis-monitoring-reporting",
          },
        ],
      },
      {
        id: "mb-organogram",
        title: "Organogram",
        type: "folder",
        countKey: "mbpmis-organogram",
        children: [
          {
            id: "mb-organogram-index",
            title: "Index",
            type: "file",
            component: "mb-pis-edms/organogram/index",
            countKey: "mbpmis-organogram",
          },
        ],
      },
      {
        id: "mb-quality-safety",
        title: "Quality Safety",
        type: "folder",
        countKey: "mbpmis-quality-total",
        children: [
          {
            id: "mb-material-test-report",
            title: "Material Test Report",
            type: "file",
            component:
              "mb-pis-edms/quality-safety/material-test-report/index",
            countKey: "mbpmis-quality-material-test",
          },
          {
            id: "mb-safety",
            title: "Safety",
            type: "file",
            component: "mb-pis-edms/quality-safety/safety/index",
            countKey: "mbpmis-quality-safety",
          },
        ],
      },
      {
        id: "mb-technical-documentation",
        title: "Technical Documentation",
        type: "folder",
        countKey: "mbpmis-technical-total",
        children: [
          {
            id: "mb-main-bridge-drawings",
            title: "Main Bridge Drawings",
            type: "file",
            component:
              "mb-pis-edms/technical-documentation/main-bridge-drawings/index",
            countKey: "mbpmis-technical-drawing",
          },
          {
            id: "mb-main-bridge-maintenance",
            title: "Main Bridge Maintenance",
            type: "file",
            component:
              "mb-pis-edms/technical-documentation/main-bridge-maintenace/index",
            countKey: "mbpmis-technical-maintenance",
          },
          {
            id: "mb-materials-equipment",
            title: "Materials And Equipment",
            type: "file",
            component:
              "mb-pis-edms/technical-documentation/materials-and-equipment/index",
            countKey: "mbpmis-technical-materials",
          },
          {
            id: "mb-others",
            title: "Others",
            type: "file",
            component: "mb-pis-edms/technical-documentation/others/index",
            countKey: "mbpmis-technical-others",
          },
          {
            id: "mb-survey-reports",
            title: "Survey Reports",
            type: "file",
            component:
              "mb-pis-edms/technical-documentation/survery-reports/index",
            countKey: "mbpmis-technical-survey-reports",
          },
        ],
      },
      {
        id: "mb-visual-records",
        title: "Visual Records",
        type: "folder",
        countKey: "mbpmis-visual-total",
        children: [
          {
            id: "mb-visual-records-index",
            title: "Pictures and Videos",
            type: "file",
            component: "mb-pis-edms/visual-records/index",
            countKey: "mbpmis-visual-pictures",
          },
        ],
      },
    ],
  },
  {
    id: "rtw",
    title: "RTW",
    type: "folder",
    countKey: "rtw-total",
    children: [
      {
        id: "rtw-monitoring-reporting",
        title: "Monitoring And Reporting",
        type: "folder",
        countKey: "rtw-monitoring-total",
        children: [
          {
            id: "rtw-daily-water-level",
            title: "Daily Water Level",
            type: "file",
            component: "rtw-edms/monitoring-and-reporting/daily-water-level-records/index",
            countKey: "rtw-monitoring-daily-water-level",
          },
          {
            id: "rtw-monthly-reports",
            title: "RTW Monthly Reports",
            type: "file",
            component: "rtw-edms/monitoring-and-reporting/monthly-report/index",
            countKey: "rtw-monitoring-monthly-report",
          },
        ],
      },
      {
        id: "rtw-technical-documentation",
        title: "Technical Documentation",
        type: "folder",
        countKey: "rtw-technical-total",
        children: [
          {
            id: "rtw-materials-equipment",
            title: "Materials Equipment",
            type: "file",
            component: "rtw-edms/technical-documentation/materials-and-equipment/index",
            countKey: "rtw-technical-materials",
          },
          {
            id: "rtw-drawing",
            title: "RTW Drawing",
            type: "file",
            component: "rtw-edms/technical-documentation/rtw-drawings/index",
            countKey: "rtw-technical-drawing",
          },
          {
            id: "rtw-maintenance",
            title: "RTW Maintenance",
            type: "file",
            component: "rtw-edms/technical-documentation/rtw-maintenance-manual/index",
            countKey: "rtw-technical-maintenance",
          },
          {
            id: "rtw-survey-reports",
            title: "Survey Reports",
            type: "file",
            component: "rtw-edms/technical-documentation/survey-reports/index",
            countKey: "rtw-technical-survey",
          },
        ],
      },
      {
        id: "rtw-project-overview",
        title: "Project Overview",
        type: "file",
        component: "rtw-edms/project-overview/index",
        countKey: "rtw-project-overview",
      },
      {
        id: "rtw-organogram",
        title: "Organogram",
        type: "file",
        component: "rtw-edms/organom/index",
        countKey: "rtw-organogram",
      },
      {
        id: "rtw-communication-correspondence",
        title: "Communication and Correspondence",
        type: "folder",
        children: [
          {
            id: "rtw-letter-correspondence",
            title: "Letter Correspondence",
            type: "file",
            component: "rtw-edms/communication-correspondence/letter-official-correspondence/index",
            countKey: "rtw-communication-letter",
          },
          {
            id: "rtw-meeting-minutes",
            title: "Meeting Minutes",
            type: "file",
            component: "rtw-edms/communication-correspondence/meeting-minutes/index",
            countKey: "rtw-communication-meeting-minutes",
          },
        ],
      },
      {
        id: "rtw-financial",
        title: "Financial",
        type: "folder",
        countKey: "rtw-financial-bills",
        children: [
          {
            id: "rtw-bills",
            title: "RTW Bills",
            type: "file",
            component: "rtw-edms/financial-documentation/rtw-bills/index",
            countKey: "rtw-financial-bills",
          },
        ],
      },
      {
        id: "rtw-quality-safety",
        title: "Quality, Safety",
        type: "folder",
        countKey: "rtw-quality-total",
        children: [
          {
            id: "rtw-material",
            title: "Material Test Report",
            type: "file",
            component: "rtw-edms/quality-safety/material-test-report/index",
            countKey: "rtw-quality-material-test",
          },
          {
            id: "rtw-safety",
            title: "Safety",
            type: "file",
            component: "rtw-edms/quality-safety/safety/index",
            countKey: "rtw-quality-safety",
          },
        ],
      },
      {
        id: "rtw-visual-records-folder",
        title: "Visual Records",
        type: "folder",
        countKey: "rtw-visual-picture",
        children: [
          {
            id: "rtw-visual-records",
            title: "Pictures and Videos",
            type: "file",
            component: "rtw-edms/visual-records/pictures-and-videos/index",
            countKey: "rtw-visual-picture",
          },
        ],
      },
    ],
  },
  {
    id: "toll-edms",
    title: "Toll Operation",
    type: "folder",
    countKey: "toll-total",
    children: [
      {
        id: "toll-daily-report",
        title: "Daily Report",
        type: "folder",
        countKey: "toll-daily-report",
        children: [
          {
            id: "toll-daily-report-index",
            title: "Index",
            type: "file",
            component: "toll-edms/report/index",
            countKey: "toll-daily-report",
          },
        ],
      },
      {
        id: "toll-daily-toll-traffic-comparison",
        title: "Daily Toll & Traffic Data",
        type: "folder",
        countKey: "toll-daily-toll-traffic-total",
        children: [
          {
            id: "toll-daily-toll-traffic-index",
            title: "Daily Toll & Traffic Data",
            type: "file",
            component: "toll-edms/daily-report/index",
            countKey: "toll-daily-toll-traffic-data",
          },
          {
            id: "toll-daily-toll-traffic-comparison-index",
            title: "Daily Toll & Traffic Data Comparison",
            type: "file",
            component: "toll-edms/daily-toll-trafic-comparison/index",
            countKey: "toll-daily-toll-traffic-comparison",
          },
        ],
      },
      {
        id: "toll-employee-personal-report",
        title: "Employee Personal Report",
        type: "folder",
        countKey: "toll-employee-personal-report",
        children: [
          {
            id: "toll-employee-personal-report-index",
            title: "Index",
            type: "file",
            component: "toll-edms/employee-personal-report/index",
            countKey: "toll-employee-personal-report",
          },
        ],
      },
      {
        id: "toll-hierarchy",
        title: "Hierarchy",
        type: "folder",
        countKey: "toll-hierarchy",
        children: [
          {
            id: "toll-hierarchy-index",
            title: "Index",
            type: "file",
            component: "toll-edms/hierarchy/index",
            countKey: "toll-hierarchy",
          },
        ],
      },
      {
        id: "toll-monthly-roster",
        title: "Monthly Roster",
        type: "folder",
        countKey: "toll-main-bridge-bills",
        children: [
          {
            id: "toll-monthly-roster-index",
            title: "Main Bridge Bills",
            type: "file",
            component: "toll-edms/main-bridge/index",
            countKey: "toll-main-bridge-bills",
          },
        ],
      },
      {
        id: "toll-shift-wise",
        title: "Shift Wise",
        type: "folder",
        countKey: "toll-shift-wise-total",
        children: [
          {
            id: "toll-shift-wise-toll-comparison",
            title: "Shift Wise Toll Comparison",
            type: "file",
            component: "toll-edms/shift-wise/shift-wise-toll-comparison/index",
            countKey: "toll-shift-wise-toll-comparison",
          },
          {
            id: "toll-shift-wise-toll-traffic-data",
            title: "Shift Wise Toll Traffic Data",
            type: "file",
            component: "toll-edms/shift-wise/shift-wise-toll-traffic-data/index",
            countKey: "toll-shift-wise-toll-traffic-data",
          },
        ],
      },
      {
        id: "toll-wim-data",
        title: "WIM Data",
        type: "folder",
        countKey: "toll-wim-total",
        children: [
          {
            id: "toll-wim-data-index",
            title: "Represent Wim Data",
            type: "file",
            component: "toll-edms/wim-data-comparison/index",
            countKey: "toll-wim-data",
          },
          {
            id: "toll-wim-data-indexs",
            title: "Wim Data Comparison",
            type: "file",
            component: "toll-edms/wim-data/index",
            countKey: "toll-wim-data-comparison",
          },
        ],
      },
    ],
  },
  {
    id: "its-edms",
    title: "ITS",
    type: "folder",
    countKey: "its-total",
    children: [
      {
        id: "its-about-us",
        title: "About Us",
        type: "folder",
        countKey: "its-about-us",
        children: [
          {
            id: "its-about-us-index",
            title: "Index",
            type: "file",
            component: "its-edms/AboutUs/index",
            countKey: "its-about-us",
          },
        ],
      },
      {
        id: "its-monthly-report",
        title: "Monthly Report",
        type: "folder",
        countKey: "its-monthly-report",
        children: [
          {
            id: "its-monthly-report-index",
            title: "Index",
            type: "file",
            component: "its-edms/MonthlyReport/index",
            countKey: "its-monthly-report",
          },
        ],
      },
      {
        id: "its-notice",
        title: "Notice",
        type: "folder",
        countKey: "its-notice",
        children: [
          {
            id: "its-notice-index",
            title: "Index",
            type: "file",
            component: "its-edms/Notice/index",
            countKey: "its-notice",
          },
        ],
      },
      {
        id: "its-operation-manual",
        title: "Operation Manual",
        type: "folder",
        countKey: "its-operation-manual",
        children: [
          {
            id: "its-operation-manual-index",
            title: "Index",
            type: "file",
            component: "its-edms/OperationManual/index",
            countKey: "its-operation-manual",
          },
        ],
      },
      {
        id: "its-organization",
        title: "Organization",
        type: "folder",
        countKey: "its-organization",
        children: [
          {
            id: "its-organization-index",
            title: "Index",
            type: "file",
            component: "its-edms/Organization/index",
            countKey: "its-organization",
          },
        ],
      },
      {
        id: "its-organogram",
        title: "Organogram",
        type: "folder",
        countKey: "its-organogram",
        children: [
          {
            id: "its-organogram-index",
            title: "Index",
            type: "file",
            component: "its-edms/Organom/index",
            countKey: "its-organogram",
          },
        ],
      },
      {
        id: "its-system-configure",
        title: "System Configure",
        type: "folder",
        countKey: "its-system-configure",
        children: [
          {
            id: "its-system-configure-index",
            title: "Index",
            type: "file",
            component: "its-edms/SystemConfigure/index",
            countKey: "its-system-configure",
          },
        ],
      },
      {
        id: "its-work-plan",
        title: "Work Plan",
        type: "folder",
        countKey: "its-work-plan",
        children: [
          {
            id: "its-work-plan-index",
            title: "Index",
            type: "file",
            component: "its-edms/WorkPlan/index",
            countKey: "its-work-plan",
          },
        ],
      },
    ],
  }
]

const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
  if (!query.trim()) return nodes

  const searchTerm = query.toLowerCase()

  return nodes
    .map((node) => {
      const titleMatch = node.title.toLowerCase().includes(searchTerm)

      const matchedChildren = node.children
        ? filterTree(node.children, query)
        : []

      if (titleMatch) {
        return {
          ...node,
          children: node.children ? [...node.children] : [],
        }
      }

      if (matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren,
        }
      }

      return null
    })
    .filter(Boolean) as TreeNode[]
}

const addCountsToTree = (
  nodes: TreeNode[],
  counts: Record<string, number>
): TreeNode[] => {
  return nodes.map((node) => {
    const children = node.children
      ? addCountsToTree(node.children, counts)
      : undefined

    const childrenTotal =
      children?.reduce((sum, child) => {
        const childCount =
          typeof child.count === "number" ? child.count : Number(child.count || 0)

        return sum + childCount
      }, 0) ?? 0

    const ownCount =
      node.countKey && counts[node.countKey] !== undefined
        ? counts[node.countKey]
        : childrenTotal || node.count

    return {
      ...node,
      count: ownCount,
      children,
    }
  })
}

export default function EdmsFileExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [countLoading, setCountLoading] = useState(false)

  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["letters"])
  )

  const [selected, setSelected] = useState<string | null>(null)
  const [ActiveComponent, setActiveComponent] =
    useState<null | React.ComponentType>(null)
  const [loadingComp, setLoadingComp] = useState(false)

  const navWithCounts = useMemo(() => {
    return addCountsToTree(navJson, counts)
  }, [counts])

  const filteredNavJson = useMemo(() => {
    return filterTree(navWithCounts, searchQuery)
  }, [navWithCounts, searchQuery])
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setCountLoading(true)

        const token = localStorage.getItem("token")

        const results = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/its/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/rtw/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/mb-pmis/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/toll/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/letter/counts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const getData = (index: number) => {
          return results[index].status === "fulfilled"
            ? results[index].value.data?.data || {}
            : {}
        }

        const adminCounts = getData(0)
        const itsCounts = getData(1)
        const roadCounts = getData(2)
        const rtwCounts = getData(3)
        const mbCounts = getData(4)
        const tollCounts = getData(5)
        const letterCounts = getData(6)

        const incomingTotal =
          (letterCounts["admin-letter-incoming"] || 0) +
          (letterCounts["road-letter-incoming"] || 0) +
          (letterCounts["mbpmis-letter-incoming"] || 0) +
          (letterCounts["rtw-letter-incoming"] || 0) +
          (letterCounts["toll-letter-incoming"] || 0) +
          (letterCounts["its-letter-incoming"] || 0)

        const outgoingTotal =
          (letterCounts["admin-letter-outgoing"] || 0) +
          (letterCounts["road-letter-outgoing"] || 0) +
          (letterCounts["mbpmis-letter-outgoing"] || 0) +
          (letterCounts["rtw-letter-outgoing"] || 0) +
          (letterCounts["toll-letter-outgoing"] || 0) +
          (letterCounts["its-letter-outgoing"] || 0)

        setCounts({
          ...adminCounts,
          ...itsCounts,
          ...roadCounts,
          ...rtwCounts,
          ...mbCounts,
          ...tollCounts,
          ...letterCounts,

          "letter-incoming-total": incomingTotal,
          "letter-outgoing-total": outgoingTotal,
          "letter-grand-total": incomingTotal + outgoingTotal,
        })
      } catch (error) {
        console.error("Failed to fetch sidebar counts:", error)
      } finally {
        setCountLoading(false)
      }
    }

    fetchCounts()
  }, [])
  useEffect(() => {
    if (!searchQuery.trim()) return

    const collectFolderIds = (
      nodes: TreeNode[],
      ids = new Set<string>()
    ) => {
      nodes.forEach((node) => {
        if (node.type === "folder") {
          ids.add(node.id)
        }

        if (node.children?.length) {
          collectFolderIds(node.children, ids)
        }
      })

      return ids
    }

    setExpanded(collectFolderIds(filteredNavJson))
  }, [searchQuery, filteredNavJson])

  async function handleChildClick(node: TreeNode) {
    if (node.type === "folder") {
      setExpanded((prev) => {
        const next = new Set(prev)
        next.has(node.id) ? next.delete(node.id) : next.add(node.id)
        return next
      })
      return
    }

    if (!node.component) return

    setSelected(node.id)
    setLoadingComp(true)
    setActiveComponent(null)

    const loadStartedAt = performance.now()

    try {
      const componentPath = `/src/pages/${node.component}.tsx`
      const importer = componentModules[componentPath]

      if (!importer) {
        throw new Error(`Component not found: ${componentPath}`)
      }

      const mod: any = await importer()
      setActiveComponent(() => mod.default)
    } catch (err) {
      console.error("Failed to load component", err)

      setActiveComponent(() => () => (
        <div className="m-6 h-full rounded-xl border border-red-100 bg-red-50/50 p-8 text-red-500">
          <FileText size={48} className="mb-4 text-red-300" />
          <h2 className="text-xl font-bold">Component Not Found</h2>
          <p className="mt-2 text-sm text-red-400">
            Make sure this file exists:
          </p>
          <code className="mt-2 block rounded border bg-white px-2 py-1 text-gray-700">
            /src/pages/{node.component}.tsx
          </code>
        </div>
      ))
    } finally {
      const elapsed = performance.now() - loadStartedAt
      const minimumDisplayMs = 350

      if (elapsed < minimumDisplayMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minimumDisplayMs - elapsed))
      }

      setLoadingComp(false)
    }
  }

  const toggleExpandOnly = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderTree = (nodes: TreeNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expanded.has(node.id)
      const isSelected = selected === node.id
      const hasChildren = !!node.children?.length

      return (
        <div key={node.id} className="flex flex-col">
          <div
            onClick={() => handleChildClick(node)}
            className={`relative flex w-full cursor-pointer select-none items-center px-3 py-1.5 ${isSelected
              ? "bg-blue-50/70 text-[#2b5296]"
              : "text-gray-700 hover:bg-gray-50"
              }`}
            style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          >
            {isSelected && (
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#3b66b5]" />
            )}

            <div className="mr-1 flex w-5 items-center justify-center">
              {node.type === "folder" && (
                <button
                  type="button"
                  onClick={(e) => toggleExpandOnly(node.id, e)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}
            </div>

            <div className="mr-2 text-gray-400">
              {node.type === "folder" ? (
                isExpanded ? (
                  <FolderOpen size={16} strokeWidth={2.5} />
                ) : (
                  <Folder size={16} strokeWidth={2.5} />
                )
              ) : (
                <FileText size={16} strokeWidth={2.5} />
              )}
            </div>

            <span
              className={`flex-1 truncate text-sm ${isSelected ? "font-semibold" : "font-medium"
                }`}
            >
              {node.title}
            </span>

            {node.count !== undefined && (
              <span className="ml-2 font-mono text-[11px] tracking-wider text-gray-400">
                {countLoading ? "..." : Number(node.count).toLocaleString()}
              </span>
            )}
          </div>

          {isExpanded && hasChildren && (
            <div className="flex flex-col">
              {renderTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      <div className="flex h-full w-80 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4 pb-2">
          <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            <Search size={16} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders & files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full bg-transparent px-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {renderTree(filteredNavJson)}
        </div>
      </div>

      <div className="relative flex h-full w-full flex-1 flex-col overflow-auto bg-white">
        {loadingComp && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white backdrop-blur-sm">
            <div className="flex items-center gap-3 text-[#0055aa]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">
                Loading
              </span>
            </div>
          </div>
        )}

        <div className="flex min-h-full w-full min-w-min flex-1 flex-col">
          {!ActiveComponent && !loadingComp && (
            <div className="flex w-full flex-1 flex-col items-center justify-center bg-white">
              <FolderOpen
                size={64}
                className="mb-4 text-gray-200"
                strokeWidth={1}
              />
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-300">
                No File Selected
              </h1>
              <p className="text-sm text-gray-400">
                Select a document from the left sidebar to view its contents.
              </p>
            </div>
          )}

          {ActiveComponent && (
            <div className="animate-in fade-in w-full flex-1 bg-white duration-300">
              <Suspense
                fallback={
                  <div className="flex h-full min-h-[50vh] w-full items-center justify-center text-gray-400">
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Rendering Component...
                  </div>
                }
              >
                <ActiveComponent />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}