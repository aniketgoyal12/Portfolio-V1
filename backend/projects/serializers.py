import json
from rest_framework import serializers
from .models import Project, Skill, Profile, MissionLog, Certification

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def to_internal_value(self, data):
        internal_data = data.copy()
        for field in ['tech_stack', 'highlights']:
            value = data.get(field)
            if isinstance(value, str):
                try:
                    internal_data[field] = json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError({field: "Invalid JSON format"})
        return super().to_internal_value(internal_data)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class MissionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionLog
        fields = '__all__'

    def to_internal_value(self, data):
        internal_data = data.copy()
        if 'contributions' in data:
            value = data.get('contributions')
            if isinstance(value, str):
                try:
                    internal_data['contributions'] = json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError({"contributions": "Invalid JSON format"})
        return super().to_internal_value(internal_data)


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
