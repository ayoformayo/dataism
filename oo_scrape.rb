require 'nokogiri'
require 'open-uri'
require 'json'
require 'pry'
require 'pp'


class WhoScoredScraper
  def initialize
    @total_fuck_ups = 5
    @reconnections = 3
    @last_type = "Defensive"
    @last_category = "tackles"
    @last_subcategory = "success"
    @last_iteration = 1
    @last_type_id = 0
    @last_category_id = 0
    @last_subcategory_id = 0
    @stats = []
    @start_from_last = File.exist?("last_downloaded.json")

    check_last_downloaded
    load_schema
    analyze_last_position
    load_existing_stats
  end

  def set_model_last_mode
    home_url = 'https://www.whoscored.com/Statistics'
    doc = Nokogiri::HTML(open(home_url))
    js_script = doc.css('script').map(&:text).select do |script|
      script.match(/headers: { 'Model-Last-Mode':/)
    end

    string = /{ 'Model-Last-Mode': .+' }/.match(js_script[0]).to_s
    formatted_string = string.split("'").join('"')
    @model_last_mode = JSON.parse(formatted_string)['Model-Last-Mode']
  end

  def check_last_downloaded
    if File.exist?("last_downloaded.json")
      data = JSON.parse(File.open("last_downloaded.json").read)
      @last_category = data["last_category"]
      @last_subcategory = data["last_subcategory"]
      @last_iteration = data["last_iteration"]
    end
  end

  def load_schema
    file = File.open('playerSchema.json')
    @typology = JSON.parse(file.read)
    if @last_category.nil? && @last_subcategory.nil?
      @last_category = @typology[0]["name"]
      @last_subcategory = @typology[0]["subcategories"][0]
    end
  end

  def analyze_last_position
    @last_type_id = @typology.index{|typ| typ["type"] == @last_type }
    @last_category_id = @typology[@last_category_id]["categories"].index{|typ| typ["name"] == @last_category }
    @last_subcategory_id = @typology[@last_type_id]["categories"][@last_category_id]["subcategories"].index(@last_subcategory)
  end

  def load_existing_stats
    if File.exist?("main_stats.json")
      @stats = JSON.parse(File.open("main_stats.json").read)
    end
  end
  def scrape_basic_shit(cat, subcat, i, type_i)
    while i <= 261 do
      # raise "eeeeeeee" if i == 5
      p "cat-#{cat}, subcat-#{subcat}, i-#{i}"
      # response = `curl "https://www.whoscored.com/StatisticsFeed/1/GetPlayerStatistics?category=#{cat}&subcategory=#{subcat}&statsAccumulationType=2&isCurrent=true&playerId=&teamIds=&matchId=&stageId=&tournamentOptions=2,3,4,5,22&sortBy=Rating&sortAscending=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=Overall&nationality=&positionOptions=&timeOfTheGameEnd=&timeOfTheGameStart=&isMinApp=true&page=#{i}&includeZeroValues=&numberOfPlayersToPick=10" -H 'Cookie: _gat=1; _ga=GA1.2.1155899746.1455997580' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,it;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://www.whoscored.com/Statistics' -H 'Model-Last-Mode: #{@model_last_mode}' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' -H 'Cache-Control: max-age=0' --compressed`
      # raise_error if response.nil?
      # parsed = JSON.parse(response)
      # @stats << parsed["playerTableStats"]
      File.open("main_stats.json","w") do |f|
        f.write(JSON.pretty_generate((@stats.flatten)))
      end

      last_json = {
        last_type: @last_type,
        last_category: @last_category,
        last_subcategory: @last_subcategory,
        last_iteration: @last_iteration
      }

      File.open("last_downloaded.json","w") do |f|
        f.write(last_json.to_json)
      end

      i += 1
      @last_category = cat
      @last_subcategory = subcat
      @last_iteration = i
      @last_type = @typology[type_i]["type"]

      p "not fucking up"
    end
    return @stats
  end

  def start_the_party
    begin
      time_now = Time.now.to_i
      # set_model_last_mode
      (@last_type_id..(@typology.length-1)).each do |type_i|
        (@last_category_id..(@typology[type_i]["categories"].length - 1)).each do |category_id|
          category = @typology[type_i]["categories"][category_id]
          (@last_subcategory_id..(category["subcategories"].length - 1)).each do |subcat|
            cat = category["name"]
            subcategory = category["subcategories"][subcat]
            if @start_from_last
              scrape_basic_shit(cat, subcategory, @last_iteration + 1, type_i)
              @start_from_last = false
            else
              scrape_basic_shit(cat, subcategory, 1, type_i)
            end
          end
        end
      end
      time_end = Time.now.to_i

      p "DONEEEEEE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
      p "time_now--------#{time_now}"
      p "time_end--------#{time_end}"
      p "DONEEEEEE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    rescue
      p "fucking up"
      @total_fuck_ups -= 1
      if @total_fuck_ups == 0
        # sleep 300
        # set_model_last_mode
        @total_fuck_ups = 5
        @reconnections -= 1
      end
      p "total_fuck_ups-#{@total_fuck_ups}"
      p "reconnections-#{@reconnections}"
      return "error" if @reconnections == 0
      unless @reconnections == 0
        @start_from_last = true
        start_the_party
      end
    end
  end
end

scraper = WhoScoredScraper.new
scraper.start_the_party
