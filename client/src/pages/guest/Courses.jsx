import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  BookOpen,
  Search,
  Star,
  Filter,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
  X,
  GraduationCap,
  PlayCircle,
  Signal,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { getAllCourses, searchCourses, getCoursesByCategory } from "../../data/sampleCourses";

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from courses
  useEffect(() => {
    const allCourses = getAllCourses();
    const uniqueCategories = [...new Set(allCourses.map(c => c.category))];
    setCategories(uniqueCategories);
  }, []);

  // Load courses
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      let results = getAllCourses();
      
      if (selectedCategory !== "all") {
        results = getCoursesByCategory(selectedCategory);
      }
      
      if (search) {
        results = searchCourses(search);
        if (selectedCategory !== "all") {
          results = results.filter(c => c.category === selectedCategory);
        }
      }

      if (selectedLevel !== "all") {
        results = results.filter(c => c.level === selectedLevel);
      }
      
      switch (sortBy) {
        case "popular":
          results = [...results].sort((a, b) => b.students - a.students);
          break;
        case "rating":
          results = [...results].sort((a, b) => b.rating - a.rating);
          break;
        case "price-low":
          results = [...results].sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          results = [...results].sort((a, b) => b.price - a.price);
          break;
        case "newest":
          results = [...results].sort((a, b) => b.id - a.id);
          break;
        default:
          break;
      }
      
      setCourses(results);
      setFilteredCourses(results);
      setLoading(false);
    }, 500);
  }, [selectedCategory, search, sortBy, selectedLevel]);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (selectedLevel !== "all") params.level = selectedLevel;
    setSearchParams(params);
  }, [search, selectedCategory, selectedLevel, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("popular");
    setSelectedLevel("all");
  };

  const getLevelColor = (level) => {
    switch(level) {
      case "Beginner": return "text-green-600 bg-green-100";
      case "Intermediate": return "text-yellow-600 bg-yellow-100";
      case "Advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const activeFiltersCount = [
    search, 
    selectedCategory !== "all", 
    selectedLevel !== "all", 
    sortBy !== "popular"
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Simplified */}
      <div className="bg-gradient-to-r from-[#03261F] to-[#0A5649] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            All Courses
          </h1>
          <p className="text-white/80 max-w-2xl">
            {filteredCourses.length} courses to help you master new skills
          </p>
        </div>
      </div>

      {/* Sticky Search Bar - Clean Design */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Search Input - Prominent */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A5649] focus:bg-white transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#0A5649] text-white border-[#0A5649]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0A5649] hover:text-[#0A5649]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-[#0A5649] rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid" 
                    ? "bg-[#0A5649] text-white" 
                    : "text-gray-600 hover:text-[#0A5649]"
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${
                  viewMode === "list" 
                    ? "bg-[#0A5649] text-white" 
                    : "text-gray-600 hover:text-[#0A5649]"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5649] cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Level Filter */}
                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5649] cursor-pointer"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A5649] cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-[#0A5649] flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Active Filter Tags */}
              {(search || selectedCategory !== "all" || selectedLevel !== "all") && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A5649]/10 text-[#0A5649] rounded-full text-xs">
                      "{search}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch("")} />
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A5649]/10 text-[#0A5649] rounded-full text-xs">
                      {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                    </span>
                  )}
                  {selectedLevel !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A5649]/10 text-[#0A5649] rounded-full text-xs">
                      {selectedLevel}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLevel("all")} />
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 text-[#0A5649]" />
            <span>
              Showing <span className="font-semibold">{filteredCourses.length}</span> courses
            </span>
          </div>
          
          {/* Mobile View Toggle */}
          <div className="sm:hidden flex border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-[#0A5649] text-white" : "text-gray-600"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-[#0A5649] text-white" : "text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className={`${viewMode === "grid" ? "h-48" : "h-32"} bg-gray-200 animate-pulse rounded-lg mb-4`} />
                <div className="h-5 bg-gray-200 animate-pulse rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#0A5649] text-white px-6 py-2.5 rounded-xl hover:bg-[#03261F] transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View - Clean Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer border border-gray-100"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="h-40 relative overflow-hidden bg-gray-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.trending && (
                    <div className="absolute top-2 left-2 bg-[#CCDE2F] text-[#03261F] px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-[#0A5649]">
                    ₹{course.price}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{course.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#0A5649] transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Math.floor(course.rating)
                              ? "fill-[#CCDE2F] text-[#CCDE2F]"
                              : star <= course.rating
                              ? "fill-[#CCDE2F] text-[#CCDE2F] opacity-50"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({course.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View - Clean Cards
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer border border-gray-100"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="flex">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{course.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      {course.trending && (
                        <span className="text-xs bg-[#CCDE2F]/20 text-[#03261F] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-[#0A5649] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students.toLocaleString()}
                      </div>
                      <div className="font-semibold text-[#0A5649]">
                        ₹{course.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}