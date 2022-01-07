import  {Providers}  from './src/Providers';
import * as TaskManager from 'expo-task-manager';
import { GeoFenceTask, LocationTask } from './src/Task';


TaskManager.defineTask("SendSMS", GeoFenceTask)

TaskManager.defineTask("LocationTask", LocationTask);

export default Providers;