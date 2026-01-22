from django.db import models

class Movie(models.Model):
    # Basic Information
    imdb_id = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    year = models.IntegerField()
    rated = models.CharField(max_length=10, null=True, blank=True)  # PG, R, PG-13, etc.
    released = models.CharField(max_length=50, null=True, blank=True)
    runtime = models.CharField(max_length=50, null=True, blank=True)
    
    # Content Details
    genre = models.CharField(max_length=200, null=True, blank=True)
    director = models.CharField(max_length=200, null=True, blank=True)
    writer = models.TextField(null=True, blank=True)
    actors = models.TextField(null=True, blank=True)
    plot = models.TextField(null=True, blank=True)  # Short summary
    language = models.CharField(max_length=300, null=True, blank=True)  # Increased for multiple languages
    country = models.CharField(max_length=300, null=True, blank=True)  # Increased for multiple countries
    awards = models.TextField(null=True, blank=True)
    
    # Media
    poster_url = models.URLField(max_length=500, null=True, blank=True)
    
    # Ratings
    imdb_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    imdb_votes = models.CharField(max_length=50, null=True, blank=True)
    metascore = models.IntegerField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'

    def __str__(self):
        return f"{self.title} ({self.year})"