// services/scheduleOptimizer.ts

interface Appointment {
    patientId: string;
    urgency: number;
    duration: number;
    preferredTime?: Date;
  }
  
  export class ScheduleOptimizer {
    async optimizeSchedule(
      appointments: Appointment[],
      availableSlots: Date[]
    ): Promise<Map<string, Date>> {
      // Ordenação por urgência
      const sortedAppointments = appointments.sort((a, b) => b.urgency - a.urgency);
      
      const schedule = new Map<string, Date>();
      
      for (const app of sortedAppointments) {
        const bestSlot = this.findBestTimeSlot(app, availableSlots);
        if (bestSlot) {
          schedule.set(app.patientId, bestSlot);
          availableSlots = availableSlots.filter(slot => slot !== bestSlot);
        }
      }
      
      return schedule;
    }
  
    private findBestTimeSlot(appointment: Appointment, availableSlots: Date[]): Date | null {
      if (appointment.preferredTime) {
        const preferredSlot = availableSlots.find(
          slot => slot.getTime() === appointment.preferredTime!.getTime()
        );
        if (preferredSlot) return preferredSlot;
      }
  
      return availableSlots[0] || null;
    }
  }