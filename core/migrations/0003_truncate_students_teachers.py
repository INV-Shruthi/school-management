from django.db import migrations

def truncate_students_and_teachers(apps, schema_editor):
    Student = apps.get_model('core', 'Student')
    Teacher = apps.get_model('core', 'Teacher')
    
    # Delete all records
    Student.objects.all().delete()
    Teacher.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_student_admission_date_student_assigned_teacher_and_more'),
    ]

    operations = [
        migrations.RunPython(truncate_students_and_teachers),
    ]
