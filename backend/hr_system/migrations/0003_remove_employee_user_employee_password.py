# Generated by Django 4.2.10 on 2024-06-12 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr_system', '0002_employee_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='user',
        ),
        migrations.AddField(
            model_name='employee',
            name='password',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
